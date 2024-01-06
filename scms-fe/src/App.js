import React, { Component } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import AppRoutes from './router/AppRouter.jsx';
import { ACCESS_TOKEN, USER_ROLE, TOKEN_EXPITY_TIME } from './constant/constain.jsx';
import Notification from './compornent/notifcation';
import './App.css';
import { Spin} from 'antd';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            currentUser: null,
            loading: true
        };
    }

    componentDidMount() {
        this.performTokenCheck();
        this.tokenCheckInterval = setInterval(this.performTokenCheck, TOKEN_EXPITY_TIME);
    }

    componentWillUnmount() {
        clearInterval(this.tokenCheckInterval);
    }

    performTokenCheck = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const expiry = localStorage.getItem('token_expiry');
        const now = new Date().getTime();

        if (!token || !expiry || now > parseInt(expiry)) {
            this.handleLogout();
        } else {
            // Set loading to false after 1 second
            setTimeout(() => {
                this.setState({ loading: false });
            }, 1000);
        }
    };

    handleLogout = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const expiry = localStorage.getItem('token_expiry');
        const now = new Date().getTime();

        if (token && expiry && now > parseInt(expiry)) {
            Notification('warning', 'Your session has expired. Please login again');
        }

        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(USER_ROLE);
        localStorage.removeItem('token_expiry');
        this.setState({
            authenticated: false,
            currentUser: null
        });

        // Set loading to false after 1 second
        setTimeout(() => {
            this.setState({ loading: false });
        }, 1000);
    };

    render() {
        if (this.state.loading) {
            return (
                <div className="loading-container">
                  <Spin size="large" />
                </div>
            );
        }

        return (
            <div className="app">
                <div className="app-body">
                    <BrowserRouter>
                        <Routes>
                            {AppRoutes().map(route => route)}
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}

export default App;
