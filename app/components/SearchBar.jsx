import { useState, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, addDays, subDays, startOfToday, isSameDay } from "date-fns";

import Popup from "../components/Popup";
import Close from "../../public/assets/Close.svg"
import Calenleft from "../../public/assets/Calenleft.svg"
import Calenright from "../../public/assets/Calenright.svg"
import { useReminder } from "@/context/ReminderContext";



const MAX_CHARS = 25; // Define the maximum character limit for display

// Utility function to truncate text
// Utility function to truncate text
const truncateText = (text, maxLength = MAX_CHARS) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

// Utility function to highlight matched terms
const highlightMatch = (text, term, maxLength = MAX_CHARS) => {
  const lowerText = text.toLowerCase();
  const lowerTerm = term.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);

  if (index === -1) {
    return truncateText(text, maxLength); // No match, just truncate
  }

  // Extract surrounding text (with context)
  const start = Math.max(0, index - 10); // Show up to 10 characters before match
  const end = Math.min(text.length, index + term.length + 10); // Show up to 10 characters after match
  const before = text.slice(start, index);
  const match = text.slice(index, index + term.length);
  const after = text.slice(index + term.length, end);

  // Combine with highlight
  const highlightedText = `${before}<span class="highlight">${match}</span>${after}`;

  // Truncate only if the entire highlighted string exceeds maxLength
  if (highlightedText.length > maxLength) {
    return truncateText(before + match + after, maxLength).replace(
      match,
      `<span class="highlight">${match}</span>`
    );
  }

  return highlightedText;
};


export default function SearchBar({ setIsOpen, userLibrary, setShowAdditionalTitles }) {
  
  const fetchTheReminder = useReminder();

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [noteDate, setNoteDate] = useState("");
  const [title1, setTitle1] = useState("");
  const [showSmallNotesCalendar, setShowSmallNotesCalendar] = useState(false);
  const [noteContent, setNoteContent] = useState("");




  const searchBarRef = useRef(null);

  useEffect(() => {
    if (userLibrary) {
      setAllData(userLibrary);
    }
  }, [userLibrary]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = [];
      const escapedSearchTerm = searchTerm.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"); // Escape special characters
  
      // Search in main notes
      allData.forEach((entry) => {
        const matchesTitle = entry.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = new Date(entry.date).toLocaleDateString('en-GB').includes(searchTerm); // Format date as 'DD/MM/YYYY'
        const matchesMainContent = entry.mainContent.toLowerCase().includes(searchTerm.toLowerCase());
  
        if (matchesTitle || matchesDate || matchesMainContent) {
          results.push({
            type: "main",
            date: entry.date,
            title: matchesTitle
              ? highlightMatch(entry.title, searchTerm)
              : truncateText(entry.title),
            content: matchesMainContent
              ? highlightMatch(entry.mainContent, searchTerm)
              : truncateText(entry.mainContent),
            parentTitle: entry.title,
            parentDate: entry.date,
            parentContent: entry.mainContent,
          });
        }
  
        // Search in small notes
        entry.smallNotes.forEach((note, index) => {
          const matchesSmallDate = new Date(note.date).toLocaleDateString('en-GB').includes(searchTerm); // Format date as 'DD/MM/YYYY'
          const matchesSmallContent = note.content.toLowerCase().includes(searchTerm.toLowerCase());
  
          if (matchesSmallDate || matchesSmallContent) {
            results.push({
              type: "small",
              date: note.date,
              content: matchesSmallContent
                ? highlightMatch(note.content, searchTerm)
                : truncateText(note.content),
              parentTitle: entry.title,
              parentDate: entry.date,
              parentContent: entry.mainContent,
              noteIndex: index //  for the scroll to the smallNote
            });
          }
        });
      });
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  }, [searchTerm, allData]);
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Logic to reset search term when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setSearchTerm(""); // Reset search term if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to clean HTML tags from a string
  const cleanHTML = (text) => {
  const div = document.createElement("div");
  div.innerHTML = text;
  return div.textContent || div.innerText || "";
};


const handleOpenPopups = (result) => {
    setSearchTerm(""); // close research when the popup opens

    setShowPopup(true); // outter laywer popup + inner conntent MainPopup
    setShowAdditionalTitles(false);
    setIsOpen(false);

    setNoteDate(new Date(result.parentDate));
    setNoteContent(result.parentContent);
    setTitle1(result.parentTitle);

  if (result.type === 'main') {

    setShowSmallNotesCalendar(false); // inner content principal is shown (sec content layer is false)

  } else {
    setShowSmallNotesCalendar(true); // inner content secundário is shown (substitui o inner content do MainPopup)
    
  }
}

  const handleClosePopup = () => {
      setShowPopup(false);
      setShowSmallNotesCalendar(false);
  };

  
  return (
    <div className="text-black  w-[550px]" ref={searchBarRef}>
      <input
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        style={{
          padding: "10px",
          width: "540px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      />

      <div className="scroll-container max-h-[224px] overflow-x-hidden overflow-y-auto">
        {filteredData.map((result, index) => (
          
          <div className="***div-onde-fazer-onclick*****"
            onClick={() => handleOpenPopups(result)}
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              width: "550px",
              backgroundColor: result.type === "main" ? "#E8EAF6" : "#F3E5F5",
            }}
          >
            <div className="flex gap-3">
              <p
                dangerouslySetInnerHTML={{
                  __html: highlightMatch(new Date(result.date).toLocaleDateString('en-GB'), searchTerm),
                }}
                style={{ fontWeight: "bold" }}
              />
              {result.type === "main" && (
                <>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: result.title,
                    }}
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: result.content,
                    }}
                  />
                </>
              )}
              {result.type === "small" && (
                <>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: result.content,
                    }}
                  />
                  <small style={{ display: "none" }}>
                    {result.parentitle} - {new Date(result.parentDate).toLocaleDateString('en-GB')}
                  </small>
                </>
              )}
            </div>
            <div className="pr-2">
            { result.type === "main" ? (<div>Main</div>) : (<div>Small</div>) }
            </div>
          </div>
        ))}
          {showPopup && (
            <div className="fixed inset-0 text-white" style={{ zIndex: 1000000000 }}>  {/* zIndex em tailwind só vai até 100 - acima de 100 tem de ser no style */}
              <div className="overlay_blur"></div>
              <div className="popup border border-white/45 z-40 ">
                <div className="popup-content flex flex-col justify-center items-center relative">
                  <div className="flex w-full justify-end items-end">
                    <button className="close-button self-end pr-2 top-5 absolute" onClick={() => handleClosePopup()}>
                      <Close />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <p onClick={() => setNoteDate(subDays(noteDate, 1))} className="pr-4 cursor-pointer"><Calenleft /></p>
                     
                     <Popup className="absolute" style={{ zIndex: 1000000000000 }}
                      noteDate={new Date(noteDate)}
                      title1={title1}
                      noteContent={noteContent}
                      
                      
                      onSave={(date, title, mainContent, smallNotes) => {
                        console.log("Entry saved:", { date, title, mainContent, smallNotes });
                      }}
                     
                      setTitle1={setTitle1}
                      showSmallNotesCalendar={showSmallNotesCalendar}
                      setShowSmallNotesCalendar={setShowSmallNotesCalendar}
                      fetchTheReminder={fetchTheReminder}
                    />
                  <p onClick={() => setNoteDate(addDays(noteDate, 1))} className="pl-4 cursor-pointer"><Calenright /></p>
              </div>
          </div>
        </div>
      </div>
       )}
      </div>
    </div>
  );
}
