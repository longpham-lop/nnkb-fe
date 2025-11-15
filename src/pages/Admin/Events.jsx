import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
import EventFormModal from "./EventFormModal";
import { formatCurrency, formatDateTime } from "./utils"; 

export default function Events({ events, setEvents }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  const handleAddNew = () => { setCurrentEvent(null); setIsModalOpen(true); };
  const handleEdit = (event) => { setCurrentEvent(event); setIsModalOpen(true); };
  const handleDelete = (id) => { if(window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) setEvents(events.filter(e => e.id !== id)); };

  const sortedEvents = useMemo(() => {
    let sortableEvents = [...events];
    sortableEvents.sort((a, b) => {
      let aValue = a[sortConfig.key], bValue = b[sortConfig.key];
      if(sortConfig.key === "date"){ aValue = new Date(aValue).getTime(); bValue = new Date(bValue).getTime(); }
      if(aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if(aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortableEvents;
  }, [events, sortConfig]);

  const filteredEvents = useMemo(() => sortedEvents.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.location.toLowerCase().includes(searchTerm.toLowerCase())), [sortedEvents, searchTerm]);

  const requestSort = (key) => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
  const getSortIcon = (key) => sortConfig.key !== key ? null : (sortConfig.direction === "asc" ? <ChevronUp size={14}/> : <ChevronDown size={14}/>);

  const getStatusBadge = (status) => {
    switch(status){
      case "Đang bán": return "badge-green";
      case "Sắp diễn ra": return "badge-blue";
      case "Đã kết thúc": return "badge-gray";
      case "Nháp": return "badge-yellow";
      default: return "badge-gray";
    }
  };

  return (
    <div>
      <div className="main-header">
        <h1>Quản lý Sự kiện</h1>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} className="search-icon"/>
            <input placeholder="Tìm kiếm sự kiện..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          </div>
          <button className="btn-submit" onClick={handleAddNew}><Plus size={18}/> Thêm Mới</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th><button onClick={()=>requestSort('name')}>Tên sự kiện {getSortIcon('name')}</button></th>
              <th>Trạng thái</th>
              <th><button onClick={()=>requestSort('date')}>Thời gian {getSortIcon('date')}</button></th>
              <th>Địa điểm</th>
              <th><button onClick={()=>requestSort('price')}>Giá vé {getSortIcon('price')}</button></th>
              <th><button onClick={()=>requestSort('stock')}>Còn lại {getSortIcon('stock')}</button></th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(e => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td><span className={`status-badge ${getStatusBadge(e.status)}`}>{e.status}</span></td>
                <td>{formatDateTime(e.date)}</td>
                <td>{e.location}</td>
                <td>{formatCurrency(e.price)}</td>
                <td>{e.stock>0 ? `${e.stock} vé` : 'Hết vé'}</td>
                <td>
                  <button className="btn-edit" onClick={()=>handleEdit(e)}><Edit2 size={18}/></button>
                  <button className="btn-delete" onClick={()=>handleDelete(e.id)}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {filteredEvents.length===0 && <tr><td colSpan="7" className="no-data">Không tìm thấy sự kiện nào.</td></tr>}
          </tbody>
        </table>
      </div>

      <EventFormModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} eventData={currentEvent} onSubmit={(data)=>{ 
        if(currentEvent){ setEvents(events.map(ev=>ev.id===currentEvent.id ? {...ev, ...data} : ev)); } 
        else{ setEvents([data,...events]); } 
        setIsModalOpen(false);
      }} />
    </div>
  );
}
