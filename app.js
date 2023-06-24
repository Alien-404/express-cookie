require('dotenv').config();

// modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieparser = require('cookie-parser');

const app = express();
const { PORT } = process.env;

app.use(
  cors({
    origin: process.env.FE_ORIGIN || 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['set-cookie'],
    // eslint-disable-next-line comma-dangle
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(morgan('dev'));

// routes
app.post('/lax', (req, res) => {
  try {
    // set cookie
    res.cookie('laxCookie', 'cookie from lax', {
      sameSite: 'lax',
      httpOnly: true,
      domain: 'http://localhost:3000',
    });
    return res.status(200).json({
      status: true,
      message: 'success',
      data: req.body,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post('/none', (req, res) => {
  try {
    // set cookie
    res.cookie('noneCookie', 'cookie from none', {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      domain: 'http://localhost:3000',
    });
    return res.status(200).json({
      status: true,
      message: 'success',
      data: req.body,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get('/clear-cookies', (req, res) => {
  const cookies = Object.keys(req.cookies);
  cookies.forEach((cookieName) => {
    res.clearCookie(cookieName);
  });

  res.status(200).json({
    status: true,
    message: 'All cookies cleared.',
    data: null,
  });
});

app.post('/manual', (req, res) => {
  try {
    // Mengatur cookie secara manual
    res.cookie('manual', 'cookie from manual', {
      maxAge: 3600000, // Waktu kadaluarsa cookie dalam milidetik (contoh: 1 jam)
      httpOnly: true, // Hanya diakses melalui protokol HTTP dan tidak dapat diakses melalui JavaScript di sisi klien
      sameSite: 'Lax', // Cookie hanya dikirim dalam konteks situs yang sama
    });
    return res.status(200).json({
      status: true,
      message: 'success',
      data: req.body,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT || 3000, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Running on port ${PORT || 3000}`);
});
