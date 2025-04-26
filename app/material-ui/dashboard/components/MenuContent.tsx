// import * as React from "react";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { Link, Navigate, Route, Routes, BrowserRouter } from "react-router";
// import BookIcon from "@mui/icons-material/Book";
// import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
// import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
// import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
// import HelpRoundedIcon from "@mui/icons-material/HelpRounded";

// const mainListItems = [
//   { text: "Books", icon: <BookIcon /> },
//   { text: "Analytics", icon: <AnalyticsRoundedIcon /> },
//   { text: "Clients", icon: <PeopleRoundedIcon /> },
//   { text: "Tasks", icon: <AssignmentRoundedIcon /> },
// ];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        {/* <Routes>
        <Route path="/home" element={<Navigate to="/home" />} />

        <Route path="/books" element={<Navigate to="/home" />} />
      </Routes> */}
      </BrowserRouter>

      {/* <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
