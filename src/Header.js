import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import { Button, IconButton, Avatar } from "@material-ui/core";
import { db, firebase, auth } from "./firebase";
import NewEvent from "./NewEvent";
import logo from "./logo.png";

function Header() {
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [LoggedInuser, setLoggedInUser] = useState("");
  const [modalState, setModalState] = useState(false);
  const [admin, setAdmin] = useState(false);

  const [addAdminModal, setAddAdminModal] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await setLoggedInUser(user);
        await setIsloggedIn(true);
        db.collection("admin").onSnapshot((snap) => {
          const data = snap.docs.map((s) => s.data());
          data.map((e) => {
            if (user.email === e.email) {
              setAdmin(true);
            }
          });
        });
      } else {
        setLoggedInUser(null);
        setIsloggedIn(false);
      }
    });
  }, [auth]);

  const logIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth
      .signInWithPopup(provider)
      .then(function (result) {
        setLoggedInUser(result);
      })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  const logOut = async () => {
    await auth.signOut();
    await setIsloggedIn(false);
    await setLoggedInUser(null);
  };

  const modalOpen = async () => {
    await setModalState(true);
  };

  const modalClose = async () => {
    await setModalState(false);
  };

  if (isLoggedIn === true) {
    return (
      <AppBar
        position="fixed"
        style={{
          backgroundColor: "#161920",
        }}
      >
        <div
          className="App_head"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            <img src={logo} style={{ width: "38px", marginRight: "10px" }} />
            <span style={{ fontSize: "24px", fontWeight: "300" }}>
              BMSCE Events
            </span>
          </div>
          <div style={{ marginLeft: "auto" }}>
            {LoggedInuser !== null ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {admin ? (
                  <IconButton onClick={modalOpen}>
                    <span
                      style={{
                        marginRight: "1px",
                        marginLeft: "10px",
                        color: "white",
                        fontSize: "38px",
                        color: "#d1d1d1",
                        fontWeight: "400",
                      }}
                    >
                      +
                    </span>
                  </IconButton>
                ) : null}
                <span
                  style={{
                    fontWeight: "600",
                    marginRight: "10px",
                    color: "#c0c0c0",
                  }}
                >
                  Hello{" "}
                  {LoggedInuser
                    ? LoggedInuser.displayName.split(/\s(.+)/)[0]
                    : null}
                </span>
                <Avatar
                  sizes="small"
                  src={LoggedInuser.photoURL}
                  style={{ marginRight: "10px" }}
                />
                <NewEvent
                  modalState={modalState}
                  setModalState={setModalState}
                  modalClose={modalClose}
                />

                <Button
                  style={{
                    backgroundColor: "black",
                    borderRadius: "3px",
                  }}
                  onClick={logOut}
                >
                  <span style={{ color: "white" }}>LogOut</span>
                </Button>
              </div>
            ) : isLoggedIn === false ? (
              <Button
                style={{
                  backgroundColor: "black",
                  borderRadius: "3px",
                }}
                onClick={logIn}
              >
                <img
                  className="google-img"
                  style={{ width: "18px" }}
                  alt="Google sign-in"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                />
                <span style={{ color: "white", marginLeft: "10px" }}>
                  LogIn
                </span>
              </Button>
            ) : null}
          </div>
        </div>
      </AppBar>
    );
  } else if (isLoggedIn === false) {
    return (
      <AppBar
        position="fixed"
        style={{
          backgroundColor: " #161920",
        }}
      >
        <div
          className="App_head"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "24px", fontWeight: "300" }}>
              BMSCE Events
            </span>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              style={{
                backgroundColor: "black",
                borderRadius: "3px",
              }}
              onClick={logIn}
            >
              <img
                className="google-img"
                style={{ width: "18px" }}
                alt="Google sign-in"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              />
              <span style={{ color: "white", marginLeft: "10px" }}>LogIn</span>
            </Button>
          </div>
        </div>
      </AppBar>
    );
  } else {
    return (
      <AppBar
        position="fixed"
        style={{
          backgroundColor: " #161920",
        }}
      >
        <div
          className="App_head"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "24px", fontWeight: "300" }}>
              BMSCE Events
            </span>
          </div>
        </div>
      </AppBar>
    );
  }
}

export default Header;
