import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ModuleItem from './ModuleItem';
import LinkColoredIcon from '../../assets/LinkColored.svg';
import PDFColoredIcon from '../../assets/PDFColored.svg';

/* 🔍 highlight helper (subtle yellow) */
const highlightText = (text, search) => {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, 'ig');
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <span
        key={i}
        style={{
          fontWeight: 700,
          fontSize: '1.05em',
          color: '#111',
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};


const ModuleCard = ({
  module,
  index,
  items,
  search,
  onEdit,
  onDelete,
  onAddItem,
  onDeleteItem,
  onDropItem,
  onReorderItems,
  onReorderModules,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const ref = useRef(null);

  const moduleItems = items.filter(i => i.moduleId === module.id);

  /* 🔎 does this module match search? */
  const hasMatch =
    search &&
    (
      module.name.toLowerCase().includes(search.toLowerCase()) ||
      moduleItems.some(i =>
        i.title.toLowerCase().includes(search.toLowerCase())
      )
    );

  /* ✅ auto-expand on search match */
  useEffect(() => {
    if (hasMatch) {
      setExpanded(true);
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [hasMatch]);

  /* ---------- DRAG MODULE ---------- */
  const [{ isDragging }, drag] = useDrag({
    type: 'MODULE',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  /* ---------- DROP MODULE ---------- */
  const [, drop] = useDrop({
    accept: 'MODULE',
    hover(dragged) {
      if (dragged.index === index) return;
      onReorderModules(dragged.index, index);
      dragged.index = index;
    },
  });

  /* ---------- DROP ITEMS ---------- */
  const [, dropItem] = useDrop({
    accept: 'ITEM',
    drop: dragged => {
      onDropItem(dragged.id, module.id);
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      id={`module-${module.id}`}
      className="module-card-container"
      style={{
        opacity: isDragging ? 0.6 : 1,
        transition: 'box-shadow 0.25s ease',
        boxShadow: hasMatch
          ? '0 0 0 2px rgba(255, 193, 7, 0.35)'
          : 'none',
      }}
    >
      {/* MODULE HEADER */}
      <div
        ref={dropItem}
        className="module-card"
        onClick={() => !hasMatch && setExpanded(p => !p)}

      >
        <div className="module-content">
          <div className="module-icon">
            <span className={`icon ${expanded ? 'expanded' : ''}`}>▼</span>
          </div>

          <div className="module-info">
            <h3 className="module-title">
              {highlightText(module.name, search)}
            </h3>
            <p className="module-subtitle">
              {moduleItems.length === 0
                ? 'Add items to this module'
                : `${moduleItems.length} item${moduleItems.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="module-actions">
          <button
            className="btn-options"
            onClick={e => {
              e.stopPropagation();
              onEdit(module);
            }}
          >
            ✏️
          </button>
          <button
            className="btn-options"
            onClick={e => {
              e.stopPropagation();
              onDelete(module.id);
            }}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      {expanded && (
        <div className="module-content-expanded">
          {moduleItems.length === 0 ? (
            <p className="empty-module-message">
              No content added to this module yet.
            </p>
          ) : (
            <div className="module-items-list">
              {moduleItems.map((item, idx) => (
                <ModuleItem
                  key={item.id}
                  item={item}
                  index={idx}
                  moduleId={module.id}
                  search={search}   
                  onDelete={onDeleteItem}
                  onReorderItems={onReorderItems}
                />
              ))}
            </div>
          )}

          <div className="add-item-container">
            <button
              className="add-item-button"
              onClick={e => {
                e.stopPropagation();
                setShowAddMenu(!showAddMenu);
              }}
            >
              ⋮
            </button>
            {showAddMenu && (
              <div className="add-item-menu">
                <button
                  className="add-item-option"
                  onClick={e => {
                    e.stopPropagation();
                    onAddItem(module.id, 'link');
                    setShowAddMenu(false);
                  }}
                >
                  <img src={LinkColoredIcon} alt="Link" style={{ width: '16px', height: '16px' }} />
                  Add link
                </button>
                <button
                  className="add-item-option"
                  onClick={e => {
                    e.stopPropagation();
                    onAddItem(module.id, 'file');
                    setShowAddMenu(false);
                  }}
                >
                  <img src={PDFColoredIcon} alt="PDF" style={{ width: '16px', height: '16px' }} />
                  Upload file
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
