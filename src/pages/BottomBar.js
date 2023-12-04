import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import MapIcon from "@material-ui/icons/Map";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    width: "25%",
    backgroundColor: "#9c27b0",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    boxShadow: "0px 10px 10px 0px rgba(0,0,0,0.5)",
    "@media (max-width:1024px)": {
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)", // Ajuste fino para centralização no mobile
      width: "calc(100% - 40%)",
    },
  },
  actionItem: {
    padding: "6px 0",
    minWidth: 0,
    "&$selected": {
      color: "white",
    },
  },
  selected: {},
  divider: {
    height: "100%", 
    alignSelf: "center", 
    backgroundColor: "white",
    margin: 0,
    width: 1, 
  },
});

export default function BottomNavBar({
  currentPage,
  onPageChange,
  profilePic,
}) {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    if (currentPage !== newValue) {
      onPageChange(newValue);
    }
  };

  const userIcon = profilePic ? (
    <Avatar
      alt="Foto do perfil"
      src={profilePic}
      style={{ width: "30px", height: "30px" }}
    />
  ) : (
    <AccountCircleIcon style={{ fontSize: "30px" }} />
  );

  return (
    <BottomNavigation
      value={currentPage}
      onChange={handleChange}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        value="mapa"
        classes={{ root: classes.actionItem, selected: classes.selected }}
        label=""
        icon={<MapIcon style={{ fontSize: 30 }} />}
      />
      <Divider orientation="vertical" flexItem className={classes.divider} />
      <BottomNavigationAction
        value="voce"
        classes={{ root: classes.actionItem, selected: classes.selected }}
        label=""
        icon={userIcon}
      />
    </BottomNavigation>
  );
}
