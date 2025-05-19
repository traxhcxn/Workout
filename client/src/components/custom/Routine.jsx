import React from 'react'
import { Button } from '../ui/button'
import { Play, Pencil, Delete, Cross, Trash } from 'lucide-react'

function Routine({ routineName, onPlayClick, onEditClick, onDeleteClick }) {
    return (
        <div className='flex items-center justify-between border rounded-2xl shadow-lg px-4 py-5 mt-3'>
            <p className='text-lg font-bold break-words flex flex-wrap'>{routineName}</p>
            <div className='flex gap-3 items-center'>
                <Button onClick={onPlayClick}>
                    <Play color='white' />
                </Button>
                <Button onClick={onEditClick}>
                    <Pencil color='white' />
                </Button>
                <Button onClick={onDeleteClick}>
                    <Trash color='white' />
                </Button>
            </div>
        </div>
    )
}

export default Routine