import { useState, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, addDays, subDays, startOfToday, isSameDay } from "date-fns";

import Popup from "../components/Popup";
import Close from "../../public/assets/Close.svg"
import Calenleft from "../../public/assets/Calenleft.svg"
import Calenright from "../../public/assets/Calenright.svg"
import SearchBox from "../../public/assets/SearchBarMini.svg"
import MainEntry from "../../public/assets/MainEntry.svg"
import MiniSmallnote from "../../public/assets/MiniSmallnote.svg"

import { useReminder } from "@/context/ReminderContext";
import { getSession } from "next-auth/react";
import { IoIosArrowForward } from "react-icons/io";




const MAX_CHARS = 20; // Define the maximum character limit for display ---> ajustado a 27/01 ------------

// Utility function to truncate text
const truncateText = (text, maxLength = MAX_CHARS) => {
  if (text.length > maxLength) {
    console.log("Truncating:", text.slice(0, maxLength) + "...");
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


export default function SearchBarMini({ setIsOpen, session_email, userLibrary, setShowAdditionalTitles, setShowPopup, setTitle1, setNoteDate, setShowSmallNotesCalendar, setNoteContent}) {
  console.log("User email:", session_email);

  
  const fetchTheReminder = useReminder();

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [email, setEmail] = useState(null);


  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session && session.user && session.user.email) {
        setEmail(session.user.email); // Update email when session is available
      } else {
        console.error("Failed to fetch session or email is missing.");
      }
    };
  
    fetchSession();
  }, []);




  const SearchBarMiniRef = useRef(null);

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
      if (SearchBarMiniRef.current && !SearchBarMiniRef.current.contains(event.target)) {
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

    if (!email) {
      console.error("Email not available yet.");
      return;
    }


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
    <div className="text-white text-lg w-[560px]" style={{ fontFamily: "Darker Grotesque" }} ref={SearchBarMiniRef}>
    {/* Search Bar Container */}
    <div className="relative search-bar-container mb-3"> {/* Added a bottom margin */}
      <div className="pb-5"><SearchBox className="absolute -left-1" /></div>
      <input
        className="absolute top-0 -left-1 bg-transparent placeholder-[#f0f0ff]"
        placeholder="Search..."
        value={searchTerm}
        autoComplete="off"
        onChange={handleChange}
        style={{
          width: "555px",
          height: "38px",
          borderRadius: "60px",
          border: "1px",
          paddingLeft: "17px",
          paddingRight: "10px",
          color: "white",
        }}
      />
    </div>

    {/* Results Container */}
      <div
        className={`mt-7 w-[550px] max-h-[550px] bg-[#afa3fa80] backdrop-blur-[3px] -ml-[3px] rounded-3xl ${
          filteredData.length > 0 && searchTerm ? "border-[0.7px] border-white/65 pb-1 pl-2 " : "border-none"
       }`}
      >
      <div>
      </div>
      <div
      className="scroll-container max-h-[215px] w-[559px] overflow-x-hidden overflow-y-auto"
      style={{ marginTop: "5px" }} // Adds spacing above the results
    >
      {filteredData.length > 0 && filteredData.map((result, index) => (
        
        <div
          className="***div-onde-fazer-onclick***** "
          onClick={() => handleOpenPopups(result)}
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            marginBottom: "2px",
            marginLeft: "1px",
            borderRadius: "20px",
            height:"37px",
            width: "auto",
            maxWidth: "540px", /* ------------> Adicionado hoje - 27/01 */
            backgroundColor: "none",
            overflow: "hidden", 
            whiteSpace: "nowrap", /* Optional: Prevent text wrapping */

          }}
        >
          <div className="flex gap-2" style={{ fontWeight: "500" }}>
            <p
              dangerouslySetInnerHTML={{
                __html: highlightMatch(
                  new Date(result.date).toLocaleDateString("en-GB"),
                  searchTerm
                ),
              }}
              style={{ fontWeight: "500" }}
            /><IoIosArrowForward className="text-[#6a6abdc7] w-3 mt-2" size={14}/>
            {result.type === "main" && (
              <>
                <p
                  dangerouslySetInnerHTML={{
                    __html: result.title,
                  }} 
                />
                <IoIosArrowForward className="text-[#6a6abdc7] w-3 mt-2" size={14}/>
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
                  {result.parentitle} -{" "}
                  {new Date(result.parentDate).toLocaleDateString(
                    "en-GB"
                  )}
                </small>
                
              </>
            )}
          </div>
          <div className="pr-2">
            {result.type === "main" ? (
              <div><MainEntry /></div>
            ) : (
              <div><MiniSmallnote /></div>
            )}
          </div>
        </div>
        ))}
      </div>
      </div>
    </div>
  );
}
