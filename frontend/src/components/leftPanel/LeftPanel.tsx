import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import IconButton from "@mui/material/IconButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  selectCustomer,
  addedCustomerData,
  deleteCustomerId,
  updateCustomerDetails,
} from "../slice/customerSlice"; // Adjust the import according to your actual slice
import Progress from "../loading/Progress";
import {
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const LeftPanel = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state: any) => state.customer.customers);

  const handleClick = (userId: Number) => {
    dispatch(selectCustomer(userId));
  };

  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [isEditMode, setIsEditMode] = useState(false); // State to track if dialog is in edit mode
  const [formData, setFormData] = useState({
    customer_id: null,
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    points: "",
  });

  // Handle form field change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for adding a new customer
  const handleSubmit = () => {
    dispatch(addedCustomerData(formData)); // Dispatch action to add customer
    handleClose(); // Close the dialog
  };

  // Handle form submission for editing a customer
  const handleUpdate = () => {
    // Dispatch action to update customer
    dispatch(updateCustomerDetails(formData)); // Adjust action and payload as needed for updating
    handleClose(); // Close the dialog
  };

  // Handle opening the dialog in edit mode
  const handleEdit = (customer: any) => {
    setFormData(customer); // Load customer data into form
    setIsEditMode(true); // Set dialog to edit mode
    setOpen(true); // Open the dialog
  };

  // Handle closing the dialog
  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false); // Reset mode to add mode
    setFormData({
      customer_id: null,
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      state: "",
      city: "",
      points: "",
    }); // Clear form data
  };

  const handleDelete = (deleteId: any) => {
    dispatch(deleteCustomerId(deleteId)); // Dispatch action to delete customer
  };

  return (
    <div>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          cursor: "pointer",
        }}
      >
        {customers ? (
          customers.map((value: any, index: any) => (
            <ListItem
              key={index}
              disableGutters
              secondaryAction={
                <IconButton aria-label="edit" onClick={() => handleEdit(value)}>
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <ContactPageIcon style={{ color: "grey" }} />
              </ListItemIcon>
              <ListItemText
                primary={`${value.first_name} ${value.last_name}`}
                secondary={value.phone}
                onClick={() => handleClick(value.customer_id)}
              />
              <IconButton
                aria-label="delete"
                onClick={() => handleDelete(value.customer_id)}
              >
                <DeleteIcon style={{ color: "grey" }} />
              </IconButton>
            </ListItem>
          ))
        ) : (
          <Progress />
        )}
        <PersonAddIcon
          onClick={() => {
            setIsEditMode(false); // Set dialog to add mode
            setOpen(true); // Open the dialog
          }}
          style={{
            position: "fixed",
            padding: "0.1rem",
            bottom: "16px",
            right: "16px",
            cursor: "pointer",
            fontSize: "2rem",
            zIndex: 1000, // Ensure the icon appears above other content
            backgroundColor: "#1976d2",
            borderRadius: "50%",
            color: "white",
          }}
        />
      </List>
      {/* Dialog for adding/editing a customer */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEditMode ? "Edit Customer" : "Add New Customer"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="first_name"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.first_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="last_name"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.last_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.city}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.state}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="points"
            label="Points"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.points}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {isEditMode ? (
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          ) : (
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeftPanel;
