import { useState, useMemo, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';
import ModuleCard from './ModuleCard';
import ModuleModal from './ModuleModal';
import LinkModal from './LinkModal';
import UploadModal from './UploadModal';
import ModuleItem from './ModuleItem';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedOutlineModule, setExpandedOutlineModule] = useState(null);

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  // compute header height and expose as CSS variable so the outline can align
  useEffect(() => {
    const setHeaderOffset = () => {
      const header = document.querySelector('.header');
      const offset = header ? header.offsetHeight : 0;
      // small extra gap to visually align with module card top
      document.documentElement.style.setProperty('--header-offset', `${offset}px`);
    };

    // initial set and on resize
    setHeaderOffset();
    window.addEventListener('resize', setHeaderOffset);
    return () => window.removeEventListener('resize', setHeaderOffset);
  }, []);

  // highlight outline item when corresponding module is in view
  useEffect(() => {
    const handleScroll = () => {
      const headerOffset = document.querySelector('.header')?.offsetHeight || 0;
      const threshold = headerOffset + 200; // trigger when module is near top

      modules.forEach(module => {
        const moduleEl = document.getElementById(`module-${module.id}`);
        const outlineBtn = document.querySelector(
          `.outline-item[data-module-id="${module.id}"]`
        );

        if (moduleEl && outlineBtn) {
          const moduleTop = moduleEl.getBoundingClientRect().top;
          if (moduleTop < threshold) {
            outlineBtn.classList.add('active');
          } else {
            outlineBtn.classList.remove('active');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [modules]);

  /* ---------- ADD FROM HEADER ---------- */

  const handleAddClick = type => {
    if (type === 'module') {
      setCurrentModule(null);
      setIsModuleModalOpen(true);
    }
    if (type === 'link') {
      setCurrentModuleId(null);
      setIsLinkModalOpen(true);
    }
    if (type === 'upload') {
      setCurrentModuleId(null);
      setIsUploadModalOpen(true);
    }
  };

  /* ---------- MODULE CRUD ---------- */

  const handleSaveModule = module => {
    setModules(prev =>
      currentModule
        ? prev.map(m => (m.id === module.id ? module : m))
        : [...prev, module]
    );
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    setItems(prev => prev.filter(i => i.moduleId !== moduleId));
  };

  /* ---------- ITEM CRUD ---------- */

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    type === 'link' ? setIsLinkModalOpen(true) : setIsUploadModalOpen(true);
  };

  const handleSaveLink = item => {
    setItems(prev => [...prev, item]);
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveUpload = item => {
    setItems(prev => [...prev, item]);
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleDeleteItem = id => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  /* ---------- DRAG & DROP ---------- */

  const moveItemToModule = (itemId, moduleId) => {
    setItems(prev =>
      prev.map(i =>
        i.id === itemId ? { ...i, moduleId } : i
      )
    );
  };

  const [, dropUnassigned] = useDrop({
    accept: 'ITEM',
    drop: dragged => {
      moveItemToModule(dragged.id, null);
    },
  });

  const reorderItems = (moduleId, from, to) => {
    setItems(prev => {
      const moduleItems = prev.filter(i => i.moduleId === moduleId);
      const others = prev.filter(i => i.moduleId !== moduleId);

      const updated = [...moduleItems];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);

      return [...others, ...updated];
    });
  };

  const reorderModules = (from, to) => {
    setModules(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  };

  /* ---------- SEARCH ---------- */

  const filteredModules = useMemo(() => {
    if (!search.trim()) return modules;

    const q = search.toLowerCase();

    return modules.filter(module => {
      if (module.name.toLowerCase().includes(q)) return true;

      return items.some(
        item =>
          item.moduleId === module.id &&
          item.title.toLowerCase().includes(q)
      );
    });
  }, [modules, items, search]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    return items.filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const unassignedItems = filteredItems.filter(i => i.moduleId === null);
  const showOutline = modules.length > 1;

  /* ---------- UI ---------- */

  return (
    <div className="course-builder">
      {/* HEADER — untouched */}
      <Header onAddClick={handleAddClick} onSearch={setSearch} />

      <div className="builder-layout">
        {/* MAIN CONTENT — EXACT SAME AS BEFORE */}
        <div className="builder-content">
          {unassignedItems.length > 0 && (
            <div ref={dropUnassigned} className="unassigned-items">
              {unassignedItems.map(item => (
                <ModuleItem
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}

          {modules.length === 0 && <EmptyState />}

          {filteredModules.map((module, index) => (
            <div id={`module-${module.id}`} key={module.id}>
              <ModuleCard
                index={index}
                module={module}
                search={search}
                items={filteredItems}
                onEdit={handleEditModule}
                onDelete={handleDeleteModule}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
                onDropItem={moveItemToModule}
                onReorderItems={reorderItems}
                onReorderModules={reorderModules}
              />
            </div>
          ))}
        </div>

        {/* OUTLINE — NEW, SAFE */}
        {showOutline && (
          <aside className="course-outline">
            <div className="outline-content">
              <h4 className="outline-title">Outline</h4>

              {modules.map(module => {
                const moduleItems = items.filter(i => i.moduleId === module.id);
                const isExpanded = expandedOutlineModule === module.id;
                
                return (
                  <div key={module.id}>
                    <button
                      className="outline-item"
                      data-module-id={module.id}
                      onClick={() =>
                        setExpandedOutlineModule(isExpanded ? null : module.id)
                      }
                    >
                      {module.name}
                    </button>
                    {isExpanded && moduleItems.map(item => (
                      <button
                        key={item.id}
                        className="outline-item child"
                        onClick={() =>
                          document
                            .getElementById(`item-${item.id}`)
                            ?.scrollIntoView({ behavior: 'smooth' })
                        }
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* MODALS — untouched */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSave={handleSaveModule}
        module={currentModule}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
      />
    </div>
  );
};

export default CourseBuilder;
