import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import ApplicationReducer from './Reducers/ApplicationReducer'
import App from './Components/App';

const store = createStore(ApplicationReducer);

ReactDOM.render(
    <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
    </Provider>,
  document.getElementById('root') as HTMLElement
);
