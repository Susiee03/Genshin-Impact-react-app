const express =require("express");
const morgan =require("morgan");
const cors =require("cors");
const { PrismaClient } = require("@prisma/client");
const expressOAuth2JwtBearer = require('express-oauth2-jwt-bearer');
const auth = expressOAuth2JwtBearer.auth;
//import { auth } from  'express-oauth2-jwt-bearer'
//import express from "express";
//import morgan from "morgan";
//import cors from "cors";
//import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256',
  timeoutDuration: 100000   //service poor, etimeout, can be delete if the network is good
});

app.get("/ping", (req, res) => {
    res.send("pong");
});
  
app.get("/games", requireAuth, async (req, res) => {
  
  const auth0Id = req.auth.payload.sub;
  
  console.log(auth0Id)

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const games = await prisma.game.findMany({
    where: {
      authorId: user.id,
    },
  });

  res.json(games);
});

// creates a game
app.post("/games", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { title } = req.body;

  if (!title) {
    res.status(400).send("title is required");
  } else {
    const newGame = await prisma.game.create({
      data: {
        title,
        author: { connect: { auth0Id } },
      },
    });
    res.status(201).json(newGame);
  }
});


//create a rating for the specific game, based on the game id
app.post("/games/:gameId/rating", requireAuth, async (req, res) => {
  //const auth0Id = req.auth.payload.sub;
  const gameId = parseInt(req.params.gameId);
  const { rating } = req.body;

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    }
  })
  if (!game) {
      res.status(404).send("Game not found.");
  } else {
    const newRating = await prisma.rating.create({
      data: {
        rating,
        game: {connect: 
          {id: gameId}
        },
      },
    });
  res.status(201).json(newRating);
  }
});

//update the rating for the specific game
app.put("/games/:gameId/ratings", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { rating } = req.body;
  const gameId = parseInt(req.params.gameId);

  if (!rating) {
    res.status(400).send("Rating is required.");
  } else {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });
    if (!user) {
      res.status(404).send("User not found.");
      return;
    }
    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });

    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: user.id,
        gameId: game.id,
      },
    });

    if (!existingRating) {
      res.status(404).send("Rating not found.");
    } else {
      const updatedRating = await prisma.rating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          rating,
        },
      });
      res.json(updatedRating);
    }
  }
});



// deletes a game by id
app.delete("/games/:id", requireAuth, async (req, res) => {
  const gameId = parseInt(req.params.id);
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    res.status(404).send("User not found.");
  } else {
    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      res.status(404).send("Game not found.");
    } else {
      const deletedGame = await prisma.game.delete({
        where: {
          id: game.id,
        },
      });
      res.json(deletedGame);
    }
  }
});


// get a game by id
app.get("/games/:id", requireAuth, async (req, res) => {
  const gameId = parseInt(req.params.id);
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    res.status(404).send("User not found.");
  } else {
    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });
    if (!game) {
      res.status(404).send("Game not found.");
    } else {
      res.json(game);
    }
  }
});


// get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  res.json(user);
});


// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  console.log(email);
  console.log("here")
  console.log(JSON.stringify(req.auth.payload))
  console.log(name);
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  console.log(user)
  if (user) {
    res.json(user);
  } else {
    try{
      const newUser = await prisma.user.create({
        data: {
          email,
          auth0Id,
          name,
        },
      });
      res.json(newUser);
    }
    catch (err) {
      console.log(err)
    }

  }
});


//Define API routes
app.listen(8000, () => {
    console.log("Server running on http://localhost:8000 🎉 🚀");
});