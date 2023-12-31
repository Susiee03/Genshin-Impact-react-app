const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const expressOAuth2JwtBearer = require('express-oauth2-jwt-bearer');
const auth = expressOAuth2JwtBearer.auth;

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


// Add rating
app.post("/ratings", requireAuth, async (req, res) => {
  const { rating } = req.body;
  const auth0Id = req.auth.payload.sub;

  if (!rating) {
    return res.status(401).send("Rating is required.");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (existingRating) {
      const updatedRating = await prisma.rating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          rating,
        },
      });
      res.status(200).json(updatedRating);
    } else {
      const newRating = await prisma.rating.create({
        data: {
          rating,
          user: {
            connect: { id: user.id },
          },
        },
      });

      res.status(201).json(newRating);
    }

  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ error: "Failed to create rating" });
  }
});

// Update rating
app.put("/ratings/:ratingId", requireAuth, async (req, res) => {
  const ratingId = parseInt(req.params.ratingId);
  const { rating } = req.body;

  if (!ratingId || !rating) {
    return res.status(401).send('Incorrect input values')
  }

  try {
    const updatedRating = await prisma.rating.update({
      where: {
        id: ratingId,
      },
      data: {
        rating,
      },
    });

    res.json(updatedRating);
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Failed to update rating" });
  }
});

// Get rating from a specific uid
app.get("/ratings", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    const ratings = await prisma.rating.findMany({
      where: {
        userId: user.id,
      },
    });

    res.json(ratings);
  } catch (error) {
    console.error("Error retrieving ratings:", error);
    res.status(500).json({ error: "Failed to retrieve ratings" });
  }
});

// Add comment
app.post("/comments", requireAuth, async (req, res) => {
  const { content } = req.body;
  const auth0Id = req.auth.payload.sub;

  if (!content) {
    return res.status(401).send("Content is required.");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    const newComment = await prisma.comment.create({
      data: {
        content,
        user: {
          connect: { id: user.id },
        },
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Delete comment
app.delete("/comments/:commentId", requireAuth, async (req, res) => {
  const commentId = parseInt(req.params.commentId);

  if (!commentId) {
    return res.status(401).send("CommentId is required.");
  }

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.sendStatus(204); // Send a success status without any content
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// Update comment
app.put("/comments/:commentId", requireAuth, async (req, res) => {
  const commentId = parseInt(req.params.commentId);
  const { content } = req.body;

  if (!commentId || !content) {
    return res.status(401).send('Incorrect input values')
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });

    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// Get comment
app.get("/comments/:commentId", requireAuth, async (req, res) => {
  const commentId = parseInt(req.params.commentId);

  if (!commentId) {
    return res.status(401).send("CommentId is required.");
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: true,
      },
    });

    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    console.error("Error retrieving comment:", error);
    res.status(500).json({ error: "Failed to retrieve comment" });
  }
});

// Get all comments
app.get("/comments", requireAuth, async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(comments);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ error: "Failed to retrieve comments" });
  }
});

// Get all comment from a specific user
app.get("/users/:userId/comments", requireAuth, async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (!userId) {
    return res.status(401).send("UserId is required.");
  }

  try {
    const userComments = await prisma.comment.findMany({
      where: {
        userId: userId,
      },
    });

    res.json(userComments);
  } catch (error) {
    console.error("Error retrieving user comments:", error);
    res.status(500).json({ error: "Failed to retrieve user comments" });
  }
});

// Get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  res.json(user);
});

// Get all joined user
app.get("/users/joined-users", async (req, res) => {
  try {
    const joinedUsers = await prisma.user.findMany(
      {
        take: 5,
        orderBy: {
          id: 'desc'
        }
      }
    );
    res.json(joinedUsers);
  } catch (error) {
    console.error("Error retrieving joined users:", error);
    res.status(500).json({ error: "Failed to retrieve joined users:" });
  }
});

// Get uid by auth0Id
app.get("/users/user-info", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  try {
    const userInfo = await prisma.user.findUnique(
      {
        where: {
          auth0Id,
        },
      }
    );
    res.json(userInfo);
  } catch (error) {
    console.error("Error retrieving user info:", error);
    res.status(500).json({ error: "Failed to retrieve user info:" });
  }
});

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  // console.log(email);
  // console.log("here")
  // console.log(JSON.stringify(req.auth.payload))
  // console.log(name);
  let extractedName = name;
  if (email.includes("@")) {
    extractedName = email.split("@")[0];
  }
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    // console.log('auth0Id');
    // console.log(auth0Id);
    // console.log('name');
    // console.log(name);
    // console.log('email');
    // console.log(email);
    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          auth0Id,
          name: extractedName,
        },
      });
      res.json(newUser);
    }
    catch (err) {
      console.log(err)
    }

  }
});

// Call External Api https://api.igdb.com/v4/games to get the info of the specific game Genshine Impact
// Write this api in service to keep the same domain avoiding cors problem
app.post('/api/games', async (req, res) => {
  const url = 'https://api.igdb.com/v4/games';
  const { clientId, accessToken } = req.body;

  if (!clientId || !accessToken) {
    return res.status(401).send("Incorrect input values.");
  }

  const fetch = await import('node-fetch');
  const response = await fetch.default(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-ID': clientId,
      Authorization: `Bearer ${accessToken}`,
    },
    body: 'fields *; where id = 119277;',
  });
  const data = await response.json();
  res.json(data);
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});