const express = require("express");

const app = express();

const { adminAuth } = require("./middleWare/auth");


// example-5

app.use("/login/user", adminAuth,(err, req, res, next) => {
    // res.send("here the user details");
    next()
});

app.use("/login/user",  ( req, res) => {
    res.send("here the user details from server");
});
  
app.use("/login", adminAuth, (req, res, next) => {
  res.send("user login successfully")
//   next();
});


// app.use() it can be handle any type of methods/HTTP calls

//order is routes important otherwise its not work

// Example-4
// here there is no error it will throws
// they will never  throw any error they can only be called
// only if the next() was called here

app.use(
  "/textNext",
  (req, res, next) => {
    console.log("res - 1");
    next();
  },
  (req, res, next) => {
    console.log("res - 2");
    res.send("response in res-2");
  },
  (req, res) => {
    console.log("res - 3");
  },
  (req, res) => {
    console.log("res - 4");
  }
);

// 3 example

// one route can also have multiple routes
// if you write like this loops runs infinite times response it come
// if you write res.send first response is come
app.use(
  "/test",
  async (req, res, next) => {
    // await res.send("i am form 1st response")
  },
  async (req, res) => {
    await res.send("i am form 2st response");
  }
);

app.use(
  "/testNext",
  async (req, res, next) => {
    // next()
    console.log("anfj");
    // await res.send("i am form 1st response");
    // next()

    next();
  },
  async (req, res) => {
    console.log("sfsdf");
    await res.send("i am form 2st response"); // now its work fine
  }
);

// it will go for 2nd response
// it throw an error :-Cannot set headers after they are sent to the client
// we already send a response to the client so we cannot change the request
// here TCP is made between the client and server
//Transmission Control Protocol (TCP) is a connection-oriented protocol for communications
// that helps in the exchange of messages between different devices over a network. It is one of the main protocols of the TCP/IP suite.
app.use(
  "/res",
  async (req, res, next) => {
    // next()
    console.log("anfj");
    await res.send("i am form 1st response");

    next();
  },
  async (req, res) => {
    console.log("sfsdf");
    await res.send("i am form 2st response"); // error comes here
  }
);

// 2 example

// if you are not provide anything inside Route handler function Its runs continuously for result
// it runs infinite loops
//it will not send any response from the server

app.use("/require", async (req, res) => {
  // await res.send("hello i am from requireId")
  console.log("hello");
});

// 1st example
app.use("/require/id", async (req, res) => {
  await res.send("hello i am from requireId");
});

app.use("/require", async (req, res) => {
  await res.send("hello i am from require");
});

app.use("/test", async (req, res) => {
  await res.send("hello i am from test");
});
app.use("/", async (req, res) => {
  await res.send("hello i am from expressJs");
});

app.listen("3000", () => {
  console.log("express successfully connected on Port 3000....");
});
