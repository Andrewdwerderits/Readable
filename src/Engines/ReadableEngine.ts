import VotableModel from '../Models/VotableModel'
import PostModel from '../Models/PostModel';
import PostModelMapper from '../Mappers/PostModelMapper';
import CommentModelMapper from '../Mappers/CommentModelMapper';
import CommentModel from '../Models/CommentModel';
import EVotableType from '../Enums/EVotableType';
import VotableModelMapper from '../Mappers/VotableModelMapper';
import ContentModel from '../Models/ContentModel';
import EContentType from '../Enums/EContentType';
import CategoryModel from '../Models/CategoryModel';
import CategoryModelMapper from '../Mappers/CategoryModelMapper';

const api = "http://localhost:3001";

let token = localStorage.token;
if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8);

const headers = {
    'Accept': 'application/json',
    'Authorization': token,
    'Content-Type': 'application/json'
};

class ReadableEngine {
    public static Vote(model: VotableModel, isUpVote: boolean): Promise<VotableModel> {
        let url = '';
        let option = isUpVote? 'upVote' : 'downVote';

        switch(model.type) {
            case EVotableType.comment:
                url = `${api}/comments/${model.parentId}`;
                break;
            case EVotableType.post:
                url = `${api}/posts/${model.parentId}`;
                break;
            default:
                throw new Error("Unknown VotableType!");
        }
        return fetch(url,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({option}),
            })
            .then((res: any) => {
                return res.json()
            })
            .then((data: any) => {
                return VotableModelMapper.entityToBusiness(data, data.id, model.type)
            });
    }

    public static GetCategories(): Promise<Array<CategoryModel>> {
        return fetch(`${api}/categories`,
            {
                    method: 'GET',
                    headers: headers,
                })
            .then(res => res.json())
            .then((data: any) => {
                let categoryModels = data.categories.map((result: any) => {
                    return CategoryModelMapper.entityToBusiness(result);
                });

                let allCategoriesModel = new CategoryModel("", "");
                allCategoriesModel.name = "All";
                allCategoriesModel.path = "";

                categoryModels.push(allCategoriesModel);

                return categoryModels;
            });
    }

    public static GetAllPostsAndComments(): Promise<Array<PostModel>> {
        return ReadableEngine.GetAllPosts()
            .then((posts: Array<PostModel>) => {
                return ReadableEngine.GetAllCommentsAndAttachToPosts(posts);
            });
    }

    private static GetAllPosts(): Promise<Array<PostModel>> {
        return fetch(`${api}/posts`,
            {
                method: 'GET',
                headers: headers,
            })
            .then((res: any) => {
                return res.json()
            })
            .then((results: any[]) => {
                return results.map((result: any) => {
                    return PostModelMapper.entityToBusiness(result);
                });
            }).then((postModels: Array<PostModel>) => {
                return postModels.filter((postModel) => {
                    return !postModel.contentModel.deleted;
                })
            })
    }

    public static GetPost(postId: string): Promise<PostModel> {
        return fetch(`${api}/posts/${postId}`,
            {
                method: 'GET',
                headers: headers,
            })
            .then((res: any) => {
                return res.json()
            })
            .then((result: any) => {
                return PostModelMapper.entityToBusiness(result);
            });
    }

    private static GetAllCommentsAndAttachToPosts(posts: Array<PostModel>): Promise<Array<PostModel>> {

        let promises: Array<Promise<Array<CommentModel>>> = [];

        posts.forEach((post: PostModel) => {
            promises.push(fetch(`${api}/posts/${post.id}/comments`,
                {
                    method: 'GET',
                    headers: headers,
                })
                .then((res: any) => {
                    return res.json()
                })
                .then((results: any[]) => {
                    return results.map((result: any) => {
                        return CommentModelMapper.entityToBusiness(result, post);
                    });
                })
                .then((commentModels: Array<CommentModel>) => {
                    return commentModels.filter((commentModel) => {
                        return !commentModel.contentModel.deleted;
                    })
                })
            );
        });

        return Promise.all(promises)
            .then((comments: Array<Array<CommentModel>>) => {
                comments.forEach((commentsForPost: Array<CommentModel>) => {
                    if (commentsForPost.length < 1) {
                        return;
                    }

                    let postForComment = posts.find((post: PostModel) => {
                        return post.id === commentsForPost[0].parentPost.id;
                    });

                    if (postForComment != null) {
                        postForComment.comments = postForComment.comments.concat(commentsForPost);
                    }
                });
                return posts;
            });
    }

    public static SaveComment(comment: CommentModel): Promise<CommentModel> {
        let url = '';
        let method = '';
        if (comment.contentModel.existsOnServer) {
            url = `${api}/comments/${comment.id}`;
            method = 'PUT';
        } else {
            url = `${api}/comments`;
            method = 'POST';
        }

        return fetch(url,
            {
                method: method,
                headers: headers,
                body: JSON.stringify(CommentModelMapper.BusinessToEntity(comment)),
            })
            .then((res: any) => {
                return res.json()
            })
            .then((result: any) => {
                return CommentModelMapper.entityToBusiness(result, comment.parentPost);
            })
    }

    public static SavePost(post: PostModel): Promise<PostModel> {

        let url = '';
        let method = '';
        if (post.contentModel.existsOnServer) {
            url = `${api}/posts/${post.id}`;
            method = 'PUT';
        } else {
            url = `${api}/posts`;
            method = 'POST';
        }

        let returnedPost: PostModel;

        return fetch(url,
            {
                method: method,
                headers: headers,
                body: JSON.stringify(PostModelMapper.BusinessToEntity(post)),
            })
            .then((res: any) => {
                return res.json()
            })
            .then((result: any) => {
                return PostModelMapper.entityToBusiness(result);
            }).then((updatedPost: PostModel) => {
                returnedPost = updatedPost;

                let promises: Array<Promise<CommentModel>> = [];
                post.comments.forEach((comment: CommentModel) => {
                    promises.push(ReadableEngine.SaveComment(comment));
                });
                return Promise.all(promises);

            }).then((comments: CommentModel[]) => {
                returnedPost.comments = comments;
                return returnedPost;
            });
    }

    public static SaveContentModel(contentModel: ContentModel, posts: PostModel[]): Promise<CommentModel | PostModel> {
        if (contentModel.type === EContentType.post) {
            return ReadableEngine.SavePost(ReadableEngine.GetPostForContentModel(posts, contentModel));
        }
        return ReadableEngine.SaveComment(ReadableEngine.GetCommentForContentModel(posts, contentModel));
    }

    public static DeletePost(id: string, type: EContentType): Promise<any> {

        let url = '';
        switch(type) {
            case EContentType.comment:
                url = `${api}/comments/${id}`;
                break;
            case EContentType.post:
                url = `${api}/posts/${id}`;
                break;
            default:
                throw new Error("Unknown VotableType!");
        }

        return fetch(url,
            {
                method: 'DELETE',
                headers: headers
            })
    }

    public static GetPostForContentModel(posts: PostModel[], contentModel: ContentModel): PostModel {
        if (contentModel.type === EContentType.comment) {
            let postForContentModel = posts.find((post: PostModel) => {
                return post.comments.find((comment: CommentModel) => {
                    return comment.id === contentModel.id;
                }) != null;
            });

            if (postForContentModel == null) {
                throw new Error("Unknown post for comment!");
            }

            return postForContentModel;

        } else {
            let postForContentModel = posts.find((post: PostModel) => {
                return post.id === contentModel.id;
            });

            if (postForContentModel == null) {
                throw new Error("Unknown post for comment!");
            }

            return postForContentModel;
        }
    }

    public static GetCommentForContentModel(posts: PostModel[], contentModel: ContentModel): CommentModel {

        for (let post of posts) {
            for (let comment of post.comments) {
                if (comment.id === contentModel.id) {
                    return comment;
                }
            }
        }
        throw new Error("Unknown post for comment!");

    }

    public static isContentModelBeingEdited(posts: PostModel[], contentModel: ContentModel, editingPostId: string) {
        let postForContentModel = ReadableEngine.GetPostForContentModel(posts, contentModel);
        return postForContentModel != null && postForContentModel.id === editingPostId;
    }

    public static isPostModelBeingEdited(post: PostModel, editPostId: string): boolean {
        return post.id === editPostId;
    }
}

export default ReadableEngine;