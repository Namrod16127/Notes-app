import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async(req, res) => {
  const { name, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.findUnique({
    where: { 
      email, 
    },
  });

  if (user) {
    return res.status(400).json("User already exists");
  }

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });


  const accessToken = jwt.sign({ createdUser }, process.env.JWT_SECRET, {
    expiresIn: "1d",
    }
  )

  return res.status(201).json({
    error: false,
    user: createdUser,
    accessToken,
    message: "Registration Successful. Please login"
  })
}


export const loginUser = async(req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  

  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }

  if (user) {
    const comparePassword = bcrypt.compareSync(password, user.password);

    if (comparePassword) {
      const payload = {
        userId: user.id,
      };

      jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d"
      }, (err, accessToken) => {
        if (err || !accessToken) {
          return res.status(401).json("Token not found");
        }
        return res.status(200).json({
          error: false,
          message: "Login successful",
          accessToken,
        })
      })
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials"
      })
    }
  }
};

export const getUser = async(req, res) => {
  
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  if (!user) {
    // return res.status(404).json({
    //   error: "User not found",
    // }); 

    return res.sendStatus(401);
  }
  return res.json({ 
    user,
    message: "",
  })
}

export const deleteUser = async(req, res) => {
 
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    }
  });

  if (!user) {
    return res.status(403).json({
      error: "You do not have permission to delete this user",
    });
  }

  if (req.userId === user.id) {
    await prisma.user.delete({
      where: { id: req.userId },
    });

    return res.json("User deleted successfully");
  }

}

export const updateUser = async(req, res) => {
 
  const { name, email } = req.body;

  const user = await prisma.user.findUnique({
    where: { 
      id: req.userId, 
    }
  });

  if (!user) {
    return res.status(403).json({
      error: "You do not have permission to update this user",
    });
  }

  if (req.userId === user.id) {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        name,
        email,
      }
    });

    return res.json({
      user,
    });
  }

}

export const getAllUsers = async(req, res) => {
  const users = await prisma.user.findMany({
    include: {
      notes: true,
    }
  })

  return res.status(200).json({
    users,
  })
}