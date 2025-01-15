import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const ConfirmationDialog = (props) => {

    const handleCancel = () => {
        props.onClose(false);
    };

    const handleOk = () => {
        props.onClose(true);
    };
    return (
        <>
            <Modal show={props.open} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleOk}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ConfirmationDialog

