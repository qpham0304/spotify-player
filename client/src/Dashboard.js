import React, { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Players from './Player'
import axios from 'axios'

const spotifyApi = new SpotifyWebApi({
  clientId: '635a703497664315a6b7948021523dc3',
})

function Dashboard({ code }) {
  let cancel = false
  const accessToken = useAuth(code)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState()
  // console.log(searchResults)

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch('')
    console.log(playingTrack)
  }

  useEffect(() => {
    if(!playingTrack) return
    axios.get('http://localhost:3001/lyrics', {
      params: {
        track: playingTrack.title,
        artist: playingTrack.artist
      }
    }).then(res => {
      setLyrics(res.data.lyrics)
    })
  }, [playingTrack])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return
    if (!search) return setSearchResults([])

    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
            if (image.height < smallest.height) return image
            return smallest
          }, track.album.images[0])
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })
    return () => {
      cancel = true
    }
  }, [search, accessToken])

  return (
    <Container className='d-flex flex-column py-2' style={{ height: '100vh' }}>
      <Form.Control
        type='search'
        placeholder='Search for songs/artist'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className='flex-grow-1 my-2' style={{ overflowY: 'auto' }}>
        {searchResults.map((track) => (
          <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
        ))}
        {searchResults.length === 0 && (
          <div className='text-center' style={{ whitespace: 'pre' }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Players accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  )
}

export default Dashboard
