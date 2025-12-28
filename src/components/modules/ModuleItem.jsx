import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const highlightText = (text, search) => {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, 'gi');
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




const ModuleItem = ({
  item,
  index,
  moduleId,
  search,          // 👈 NEW
  onDelete,
  onReorderItems,
}) => {
  const ref = useRef(null);

  /* ---------- DROP ---------- */
  const [, drop] = useDrop({
    accept: 'ITEM',
    hover(dragged) {
      if (!ref.current) return;
      if (dragged.moduleId !== moduleId) return;
      if (dragged.index === index) return;

      onReorderItems(moduleId, dragged.index, index);
      dragged.index = index;
    },
  });

  /* ---------- DRAG ---------- */
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { id: item.id, index, moduleId },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      id={`item-${item.id}`}
      ref={ref}
      className="module-item"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <div className="item-content">
        <div className="item-icon">
          {item.type === 'link' ? '🔗' : '📄'}
        </div>

        <div className="item-info">
          <p className="item-title">
  {highlightText(item.title, search)}
</p>

        </div>
      </div>

      <button
        className="item-delete"
        onClick={e => {
          e.stopPropagation();
          onDelete(item.id);
        }}
      >
        🗑️
      </button>
    </div>
  );
};

export default ModuleItem;
