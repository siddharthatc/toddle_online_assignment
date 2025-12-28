import { useState, useRef, useEffect } from 'react';
import SearchOutlinedIcon from '../../assets/SearchOutlined.svg';
import AddOutlinedIcon from '../../assets/AddOutlined.svg';

const Header = ({ onAddClick, onSearch }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="header">
      <div className="header-inner">
        <h1 className="header-title">Course builder</h1>

        <div className="header-right">
          <div className="search-wrapper">
            <img src={SearchOutlinedIcon} alt="Search" className="search-icon" />
            <input
              className="search-input"
              placeholder="Search..."
              onChange={e => onSearch(e.target.value)}
            />
          </div>

          <div ref={ref} className="dropdown-container">
            <button className="add-button" onClick={() => setOpen(p => !p)}>
              <img src={AddOutlinedIcon} alt="Add" className="add-button-icon" />
              Add
            </button>

            {open && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => onAddClick('module')}
                >
                  📄 Create module
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => onAddClick('link')}
                >
                  🔗 Add link
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => onAddClick('upload')}
                >
                  ⬆️ Upload file
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
