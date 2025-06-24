
import { useState, useRef, useEffect } from "react";
import { Search, Play, Pause, SkipForward, SkipBack, Volume2, Music, Heart, Shuffle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Expanded sample song data with more royalty-free tracks
const SAMPLE_SONGS = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    duration: "5:55",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    genre: "Rock"
  },
  {
    id: 2,
    title: "Imagine",
    artist: "John Lennon",
    duration: "3:07",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    genre: "Pop"
  },
  {
    id: 3,
    title: "Hotel California",
    artist: "Eagles",
    duration: "6:30",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    genre: "Rock"
  },
  {
    id: 4,
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    duration: "5:03",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    genre: "Rock"
  },
  {
    id: 5,
    title: "Billie Jean",
    artist: "Michael Jackson",
    duration: "4:54",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    genre: "Pop"
  },
  {
    id: 6,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    duration: "8:02",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    genre: "Rock"
  },
  {
    id: 7,
    title: "Like a Rolling Stone",
    artist: "Bob Dylan",
    duration: "6:13",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    genre: "Folk"
  },
  {
    id: 8,
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    duration: "5:01",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    genre: "Grunge"
  },
  {
    id: 9,
    title: "Ambient Dreams",
    artist: "SoundHelix",
    duration: "4:32",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    genre: "Ambient"
  },
  {
    id: 10,
    title: "Electronic Vibes",
    artist: "SoundHelix",
    duration: "3:45",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    genre: "Electronic"
  },
  {
    id: 11,
    title: "Jazz Fusion",
    artist: "SoundHelix",
    duration: "5:12",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    genre: "Jazz"
  },
  {
    id: 12,
    title: "Classical Symphony",
    artist: "SoundHelix",
    duration: "7:30",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    genre: "Classical"
  },
  {
    id: 13,
    title: "Reggae Sunset",
    artist: "SoundHelix",
    duration: "4:15",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    genre: "Reggae"
  },
  {
    id: 14,
    title: "Country Road",
    artist: "SoundHelix",
    duration: "3:58",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    genre: "Country"
  },
  {
    id: 15,
    title: "Hip Hop Beats",
    artist: "SoundHelix",
    duration: "4:22",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    genre: "Hip Hop"
  }
];

const Index = () => {
  const [songs, setSongs] = useState(SAMPLE_SONGS);
  const [filteredSongs, setFilteredSongs] = useState(SAMPLE_SONGS);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [currentGenre, setCurrentGenre] = useState("All");
  
  const audioRef = useRef(null);

  // Get unique genres
  const genres = ["All", ...new Set(songs.map(song => song.genre))];

  // Search and filter functionality
  useEffect(() => {
    let filtered = songs;
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        song =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by genre
    if (currentGenre !== "All") {
      filtered = filtered.filter(song => song.genre === currentGenre);
    }
    
    setFilteredSongs(filtered);
  }, [searchQuery, songs, currentGenre]);

  // Fetch additional songs from Free Music Archive API (demo function)
  const fetchAPIMusic = async () => {
    setIsLoading(true);
    try {
      // Note: This is a placeholder for API integration
      // In a real app, you would use a proper music API like Spotify, Last.fm, or Free Music Archive
      toast.success("API Music feature coming soon! For now, enjoy our curated collection.");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // You could add more songs here from an actual API
      console.log("API integration placeholder - add your favorite music API here");
      
    } catch (error) {
      toast.error("Failed to fetch additional music");
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Auto-play next song
      skipToNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [currentSong]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const playSong = (song) => {
    console.log('Playing song:', song.title);
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      setCurrentSong(song);
      setCurrentTime(0);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
          toast.success(`Now playing: ${song.title}`);
        }
      }, 100);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipToNext = () => {
    if (!currentSong) return;
    const currentIndex = filteredSongs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    playSong(filteredSongs[nextIndex]);
  };

  const skipToPrevious = () => {
    if (!currentSong) return;
    const currentIndex = filteredSongs.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? filteredSongs.length - 1 : currentIndex - 1;
    playSong(filteredSongs[prevIndex]);
  };

  const seekTo = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };

  const toggleFavorite = (songId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(songId)) {
      newFavorites.delete(songId);
      toast.success("Removed from favorites");
    } else {
      newFavorites.add(songId);
      toast.success("Added to favorites");
    }
    setFavorites(newFavorites);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Music className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  StreamIt Music
                </h1>
                <p className="text-sm text-gray-300">Your premium music experience</p>
              </div>
            </div>
            
            <Button
              onClick={fetchAPIMusic}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? "Loading..." : "Discover More Music"}
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search songs, artists, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-sm focus:bg-white/20 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <ScrollArea className="w-full">
            <div className="flex space-x-2 pb-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={currentGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentGenre(genre)}
                  className={`whitespace-nowrap transition-all duration-300 ${
                    currentGenre === genre
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20 border-white/20"
                  }`}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {searchQuery ? `Search Results (${filteredSongs.length})` : `${currentGenre} Music`}
            </h2>
            <div className="text-sm text-gray-400">
              {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className={`group relative bg-white/5 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:scale-105 border border-white/10 ${
                  currentSong?.id === song.id ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/50' : ''
                }`}
                onClick={() => playSong(song)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {currentSong?.id === song.id && isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(song.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-white/10 px-2 py-1 rounded-full">{song.genre}</span>
                    <span>{song.duration}</span>
                  </div>
                </div>
                
                {/* Playing animation */}
                {currentSong?.id === song.id && isPlaying && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <div className="w-1 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-1 h-4 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredSongs.length === 0 && (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No songs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 p-4 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Current Song Info */}
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Music className="w-8 h-8" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{currentSong.title}</p>
                  <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
                  <p className="text-xs text-gray-500">{currentSong.genre}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(currentSong.id)}
                  className="text-gray-400 hover:text-white"
                >
                  <Heart className={`w-5 h-5 ${favorites.has(currentSong.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>

              {/* Playback Controls */}
              <div className="flex flex-col items-center space-y-3 flex-2">
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Shuffle className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipToPrevious}
                    className="text-white hover:text-purple-400 transition-all duration-300 hover:scale-110"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayPause}
                    className="text-white hover:text-purple-400 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-110"
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipToNext}
                    className="text-white hover:text-purple-400 transition-all duration-300 hover:scale-110"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Repeat className="w-5 h-5" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center space-x-3 w-full max-w-lg">
                  <span className="text-xs text-gray-400 w-12 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={seekTo}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400 w-12">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3 min-w-0 flex-1 justify-end">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <Slider
                  value={volume}
                  max={100}
                  step={1}
                  onValueChange={setVolume}
                  className="w-24"
                />
                <span className="text-xs text-gray-400 w-8">{volume[0]}%</span>
              </div>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={currentSong?.audioUrl}
            preload="metadata"
          />
        </div>
      )}
    </div>
  );
};

export default Index;
