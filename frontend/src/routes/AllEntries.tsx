import { useContext } from 'react';
import { EntryContext } from '../utilities/globalContext';
import { EntryContextType, Entry } from '../@types/context';
import { useNavigate, Link } from "react-router-dom";

export default function AllEntries() {
    const { entries, deleteEntry } = useContext(EntryContext) as EntryContextType;
    let navigate = useNavigate();
    
    if (entries.length === 0) {
        return (
            <section>
                <h1 className="text-center font-semibold text-2xl m-5">You don't have any cards</h1>
                <p className="text-center font-medium text-md">Let's <Link className="text-blue-400 underline underline-offset-1" to="/create">Create One</Link></p>
            </section>
        );
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysTasks = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.toDateString() === today.toDateString();
    });
    
    const scheduledTasks = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate > today && entryDate.toDateString() !== today.toDateString();
    });
    
    const pastTasks = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate < today;
    });
    
    return (
        <section className="flex flex-col gap-10">
            <div>
                <h2 className="text-xl font-semibold">Today's Tasks</h2>
                <div className="grid grid-cols-2 md:grid-cols-4">
                    {todaysTasks.map((entry: Entry, index: number) => (
                        <TaskCard key={index} entry={entry} navigate={navigate} deleteEntry={deleteEntry} />
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold">Scheduled Tasks</h2>
                <div className="grid grid-cols-2 md:grid-cols-4">
                    {scheduledTasks.map((entry: Entry, index: number) => (
                        <TaskCard key={index} entry={entry} navigate={navigate} deleteEntry={deleteEntry} scheduled />
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold">Past Tasks</h2>
                <div className="grid grid-cols-2 md:grid-cols-4">
                    {pastTasks.map((entry: Entry, index: number) => (
                        <TaskCard key={index} entry={entry} navigate={navigate} deleteEntry={deleteEntry} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TaskCard({ entry, navigate, deleteEntry, scheduled }: { entry: Entry, navigate: any, deleteEntry: any, scheduled?: boolean }) {
    return (
        <div id={entry.id} className="bg-gray-300 shadow-md shadow-gray-500 m-3 p-4 rounded flex flex-col justify-between">
            <h1 className="font-bold text-sm md:text-lg">{entry.title}</h1>
            <p className="text-center text-lg font-light md:mt-2 md:mb-4 mt-1 mb-3">{entry.description}</p>
            <section className="flex items-center justify-between flex-col md:flex-row pt-2 md:pt-0">
                <div className="flex justify-center">
                    <button onClick={() => { deleteEntry(entry.id as string) }} className="m-1 md:m-2 p-1 font-semibold rounded-md bg-red-500 hover:bg-red-700">✖</button>
                    <button onClick={() => { navigate(`/edit/${entry.id}`, { replace: true }); }} className="m-1 md:m-2 p-1 font-semibold rounded-md bg-blue-500 hover:bg-blue-700">🖊</button>
                </div>
                <div className="text-right text-sm md:text-lg">
                    {scheduled ? (
                        <p>Scheduled: {new Date(entry.created_at).toLocaleDateString()}</p>
                    ) : (
                        <p>Created: {new Date(entry.created_at).toLocaleDateString()}</p>
                    )}
                </div>
            </section>
        </div>
    );
}
