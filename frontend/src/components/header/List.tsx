import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { selectCustomer } from "../slice/customerSlice";

export default function PinnedSubheaderList() {
  const dispatch = useDispatch();
  const searchData = useSelector((state: any) => state.search.searchData);

  const handleList = (userId: Number) => {
    console.log("userId---> ", userId);
    dispatch(selectCustomer(userId));
  };
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        position: "absolute",
        overflow: "auto",
        cursor: "pointer",
        maxHeight: 300,
        color: "black",
        "& ul": { padding: 0 },
      }}
    >
      {searchData.map((item: any) => (
        <ListItem
          key={item.customer_id}
          onClick={() => handleList(item.customer_id)}
        >
          <ListItemText
            primary={`${item.first_name} ${item.last_name}`}
            secondary={item.phone}
          />
        </ListItem>
      ))}
    </List>
  );
}
