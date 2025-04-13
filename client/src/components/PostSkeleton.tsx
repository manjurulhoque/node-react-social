import React from "react";
import { Card } from "react-bootstrap";

const PostSkeleton: React.FC = () => {
    return (
        <Card className="card-block card-stretch card-height mb-4">
            <Card.Body>
                <div className="d-flex align-items-center mb-3">
                    <div
                        className="rounded-circle bg-light"
                        style={{ width: "60px", height: "60px" }}
                    ></div>
                    <div className="ms-3">
                        <div
                            className="bg-light"
                            style={{
                                width: "150px",
                                height: "20px",
                                marginBottom: "5px",
                            }}
                        ></div>
                        <div
                            className="bg-light"
                            style={{ width: "100px", height: "15px" }}
                        ></div>
                    </div>
                </div>
                <div
                    className="bg-light mb-2"
                    style={{ width: "100%", height: "20px" }}
                ></div>
                <div
                    className="bg-light mb-2"
                    style={{ width: "100%", height: "20px" }}
                ></div>
                <div
                    className="bg-light"
                    style={{ width: "80%", height: "20px" }}
                ></div>
                <div className="d-flex justify-content-between mt-3">
                    <div
                        className="bg-light"
                        style={{ width: "100px", height: "20px" }}
                    ></div>
                    <div
                        className="bg-light"
                        style={{ width: "100px", height: "20px" }}
                    ></div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PostSkeleton;
