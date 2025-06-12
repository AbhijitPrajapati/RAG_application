import React  from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export default function CollectionSelection( {selected, toggleCollection, collections} ) {
    // collections = ['collection_1', 'collection_2', 'collection_3', 'collection_1', 'collection_2', 'collection_3','collection_1', 'collection_2', 'collection_3', 'collection_1', 'collection_2', 'collection_3'];
    // replace max-h-[200px] with just h-[200px] to make it the mininum height
    return (
        <div className='p-3 w-full'>
            <Label className='text-center m-2 p-1'>Collections</Label>
            <ScrollArea className='border rounded-2xl [&>[data-radix-scroll-area-viewport]]:max-h-[200px] w-full p-4'> 
                <div>
                    {collections.map((name) => (
                        <div key={name}>
                            <Checkbox 
                                checked={selected.has(name)}
                                onCheckedChange={() => toggleCollection(name)}
                            />
                            <label>{name}</label>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}