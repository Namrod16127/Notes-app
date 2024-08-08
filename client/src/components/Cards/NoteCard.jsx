
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

export default function NoteCard({ 
  title, 
  date, 
  content, 
  tags, 
  isPinned, 
  onEdit, 
  onDelete, 
  onPinNote 
}) {
  return (
    <div className="border rounded p-4 mx-16 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className='text-sm font-semibold'>{title}</h6>
          <span className='text-xs font-semibold text-slate-500'>{moment(date).format("Do MMM YYYY")}</span>
        </div>

        <MdOutlinePushPin className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`} onClick={onPinNote} />
      </div>
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">{tags.map((item) => `#${item} `)}</div>
        
        

        <div className="flex items-center gap-2">
          <MdCreate 
            className="icon-btn hover:text-green-600" 
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500" 
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  )
}
