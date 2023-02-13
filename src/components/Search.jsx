import { IconButton, Input } from "@material-tailwind/react";
import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function Search() {
    const MySwal = withReactContent(Swal);
    const [postSearch, setPostsearch] = useState('');
    const [updated, setUpdated] = useState('');

    function handleInputChanged() {
        var textSearch = document.getElementById('searching').value;
        setPostsearch(textSearch);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            var searchQuery = postSearch;
            setUpdated(window.location.href = "/search/" + searchQuery);
        }
    }

    function handleButtonClicked() {
        var searchQuery = postSearch;
        if (searchQuery.length == 0) {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                html: 'What are you looking for?',
            })
        } else {
            document.getElementById('searching').value = '';
            window.location.href = "/search?q=" + searchQuery;
        }
    }

    return (
        <>
            <div className="flex items-center">
                <div className="mr-4 md:mr-2 md:w-56">
                    <Input label="Search" type={"search"} autoComplete="off" id="searching" onKeyUp={handleInputChanged} onKeyDown={handleKeyDown} required />
                </div>
                <button onClick={handleButtonClicked} className="w-auto h-auto">
                    <SearchIcon className="h-100 w-100 text-blue-gray-500" />
                </button>
            </div>
        </>
    )
}

export default Search;