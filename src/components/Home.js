import React, { useEffect, useState } from 'react';
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import '../styles/global.css';

import getSpotifyToken from "../utils/getSpotifyToken";
import Card from "./Card";

function Home() {
  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState([]);
  const [visible, setVisible] = useState(10);
  const [error, setError] = useState('');

  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  const baseURL = (search, limit) =>
    `https://api.spotify.com/v1/search?q=${search}&type=track&limit=${limit}`;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!search) {
      setTracks([]);
      setShowLoadMoreBtn(false);
      return;
    };

    setVisible(10);
    setShowLoadMoreBtn(false);
    setError('');
    setLoading(true);
    setTracks([]);

    try {
      const token = await getSpotifyToken();

      const response = await fetch(baseURL(search, visible), {
        headers: {
          Authorization: token
        }
      });

      const res = await response.json();
      const { tracks } = res;

      if (!tracks || tracks.items.length === 0) {
        setError('No matches were found.');
        setShowLoadMoreBtn(false);
        setTracks([]);
      }

      setTracks(tracks.items);
      setShowLoadMoreBtn(true);
    } catch (error) {
      setError(error.message);
      setTracks([]);
      setShowLoadMoreBtn(false);
    }

    setLoading(false);
  }

  async function handleOnClick() {
    try {
      const token = await getSpotifyToken();

      const response = await fetch(baseURL(search, visible), {
        headers: {
          Authorization: token
        }
      });

      const res = await response.json();
      const { tracks } = res;

      if (!tracks || tracks.items.length === 0 || res.status === 404) {
        setError('No matches were found.');
        setShowLoadMoreBtn(false);
        setTracks([]);
      }

      setTracks(tracks.items);
      setShowLoadMoreBtn(true);
    } catch (error) {
      setError(error.message);
      setShowLoadMoreBtn(false);
      setTracks([]);
    }
  }

  useEffect(() => {
    if (!search) {
      return;
    }

    handleOnClick();
  }, [visible]);

  return (
    <div className="App">
      <div className="search-bar">
        <a href="/">
          <img
            className="spotify-logo"
            src="./assets/Spotify_Logo_RGB_Green.png"
            alt="Spotify logo"
          />
        </a>

        <form onSubmit={handleSubmit}>
          <div className="input-bar">
            <input
              className="input"
              placeholder="song, album, artist..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading &&
              <img
                className="loading"
                src="./assets/loading-buffering.gif"
                alt="Loading icon"
              />
            }

            {!loading &&
              <button className='form-submit-btn'>
                <img src="./assets/icons8-magnifying-glass-64.png" alt="Search icon" width="25px" />
              </button>
            }
          </div>

        </form>

      </div>
      {
        error &&
        <span className="error">
          {error}
        </span>
      }

      {!showLoadMoreBtn &&

        <div className="placeholder">
          <RoughNotation type="box" color="#18a549" show={!showLoadMoreBtn}>
            <h1 className="placeholder-text">Start by searching a song title, artist or album!</h1>
          </RoughNotation>
        </div>
      }

      <div className="tracks-container">
        {tracks && tracks.map((track, i) => (
          <Card
            track={track}
            key={i}
          />
        ))}
      </div>

      {showLoadMoreBtn &&
        <div>
          <button className="load-more-btn"
            onClick={() => setVisible(visible + 10)}>Load more</button>
        </div>}

      <RoughNotation type="underline" color="#18a549" show={true} style={{ alignSelf: 'end', color: '#c5c5c5' }}>
        made by <a href="https://github.com/jfsax" style={{ all: 'unset', cursor: 'pointer', color: '#1db954' }}>Jessica X</a> with 💚
      </RoughNotation>
    </div >
  );
}

export default Home;