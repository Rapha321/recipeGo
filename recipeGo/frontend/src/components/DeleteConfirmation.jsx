import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';



const DeleteConfirmationDialog = ({ open, onCancel, onConfirm }) => {

    return (
            <Dialog
                open={open}
                onClose={onCancel}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Are you sure you want to delete this recipe?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
    )

}

export default DeleteConfirmationDialog;