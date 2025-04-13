import React from 'react';
import { Alert } from 'react-bootstrap';

interface IProps {
    variant?: string;
    children?: any;
}

const Message: React.FC<IProps> = ({ variant = "info", children }) => {
    return <Alert variant={variant}>{children}</Alert>
}

export default Message;