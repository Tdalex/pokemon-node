const mongoose = require("mongoose");
const fetch     = require("node-fetch");
const cheerio   = require("cheerio");
const jsonframe = require("jsonframe-cheerio");
const download  = require("image-downloader");
const express   = require('express');
const jwt       = require('jsonwebtoken');


mongoose.connect("mongodb://localhost/pokedex");