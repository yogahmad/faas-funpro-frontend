import '../App.css';
import { Link } from 'react-router-dom';

export function HomePage() {
    return (
        <div className="App">
            <header className="App-header">
                <Link to="/imgur-album-downloader">
                    <button class="bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-xl border-4 text-white py-1 px-2 rounded" type="button">
                        Imgur Album Downloader
                    </button>
                </Link>
                <Link to="/file-zipper">
                    <button class="bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-xl border-4 text-white py-1 px-2 rounded m-10" type="button">
                        File Zipper
                    </button>
                </Link>
                <Link to="/file-unzipper">
                    <button class="bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-xl border-4 text-white py-1 px-2 rounded" type="button">
                        File Unzipper
                    </button>
                </Link>

            </header>
        </div>
    );
}