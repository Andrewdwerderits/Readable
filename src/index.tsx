import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, Store } from 'redux'
import { ApplicationReducer }  from './Reducers/ApplicationReducer'
import App from './Components/App';
import AppStore from './Reducers/AppStore';

const store: Store<AppStore> = createStore(ApplicationReducer);

ReactDOM.render(
    <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
    </Provider>,
  document.getElementById('root') as HTMLElement
);
