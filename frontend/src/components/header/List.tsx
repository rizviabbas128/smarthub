import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useSelector } from "react-redux";

export default function PinnedSubheaderList() {
  const searchData = useSelector((state: any) => state.search.searchData);
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        position: "absolute",
        overflow: "auto",
        maxHeight: 300,
        color: "black",
        "& ul": { padding: 0 },
      }}
    >
      {searchData.map((item: any) => (
        <ListItem key={item.customer_id}>
          <ListItemText
            primary={`${item.first_name} ${item.last_name}`}
            secondary={item.phone}
          />
        </ListItem>
      ))}
    </List>
  );
}
