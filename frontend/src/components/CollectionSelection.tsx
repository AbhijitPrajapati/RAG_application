import React  from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useCollections } from '@/stores/useCollectionStore';
import {useSelectedIds, useToggleCollection} from '@/stores/useSelectedCollectionsStore';

export default function CollectionSelection() {
    const collections = useCollections();
    const selected_ids = useSelectedIds();
    const toggleCollection = useToggleCollection();
    // const { selected_ids, toggleCollection } = useSelectedCollectionsStore();

    // collections = ['collection_1', 'collection_2', 'collection_3', 'collection_1', 'collection_2', 'collection_3','collection_1', 'collection_2', 'collection_3', 'collection_1', 'collection_2', 'collection_3'];
    // replace max-h-[200px] with just h-[200px] to make it the mininum height
    return (
        <div className='w-full p-3'>
            <Label className='text-center m-2 p-1'>Collections</Label>
            <ScrollArea className='border rounded-2xl [&>[data-radix-scroll-area-viewport]]:max-h-[200px] w-full p-4'> 
                <div>
                    {collections.map(({id, name}) => (
                        <div key={id}>
                            <Checkbox 
                                checked={selected_ids.has(id)}
                                onCheckedChange={() => toggleCollection(id)}
                            />
                            <label>{name}</label>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}