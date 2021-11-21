import { ImgurAlbumDownloader } from './pages/ImgurAlbumDownloader';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { HomePage } from './pages/HomePage.js';
import { FileZipper } from './pages/FileZipper';
import { FileUnzipper } from './pages/FileUnzipper.js';


function App() {
  return (
    <Router>

      <Routes>
        <Route path="/imgur-album-downloader" element={<ImgurAlbumDownloader />} />
        <Route path="/file-zipper" element={<FileZipper />} />
        <Route path="/file-unzipper" element={<FileUnzipper />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
