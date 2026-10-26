import { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

function Navbar() {
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">E</span>
        <span>
          Gather<span className="brand-accent">Desk</span>
        </span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/add">Add Event</NavLink>
      </nav>
    </header>
  );
}

function Dashboard() {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.message || '');

  async function loadEvents() {
    try {
      setError('');
      const response = await axios.get(API_URL);
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      console.error('Could not load events:', requestError);
      setError('Could not load events. Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function deleteEvent(id) {
    const confirmed = window.confirm('Delete this event? This cannot be undone.');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event._id !== id)
      );
      setNotice('Event deleted successfully.');
      setError('');
    } catch (requestError) {
      console.error('Could not delete event:', requestError);
      setError('Could not delete the event. Please try again.');
    }
  }

  return (
    <main className="page dashboard-page">
      <section className="page-heading">
        <div className="heading-copy">
          <p className="eyebrow">EVENT MANAGEMENT</p>
          <h1>Dashboard</h1>
          <p>Keep your upcoming events organised in one place.</p>
        </div>

        <Link className="primary-button" to="/add">
          + Add Event
        </Link>
      </section>

      {notice && <p className="notice success">{notice}</p>}
      {error && <p className="notice error">{error}</p>}

      <section className="events-card">
        <div className="card-heading">
          <div>
            <h2>All events</h2>
            <p>
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </p>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Loading events…</p>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <h3>No events yet</h3>
            <p>Create your first event to get started.</p>
            <Link className="primary-button" to="/add">
              Create an event
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Event Name</th>
                  <th>Event Date</th>
                  <th>Venue</th>
                  <th>Total Registrations</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td className="event-id">{event._id}</td>
                    <td className="event-name">{event.eventName}</td>
                    <td>
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>{event.venue}</td>
                    <td>
                      <span className="registration-count">
                        {event.registrations?.length ?? 0}
                      </span>
                    </td>
                    <td className="actions">
                      <Link
                        className="secondary-button"
                        to={`/edit/${event._id}`}
                      >
                        Update
                      </Link>
                      <button
                        className="delete-button"
                        onClick={() => deleteEvent(event._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function EventForm({ editing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    eventName: '',
    description: '',
    eventDate: '',
    venue: '',
  });

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;

    async function loadEvent() {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        const event = response.data;

        setForm({
          eventName: event.eventName || '',
          description: event.description || '',
          eventDate: event.eventDate
            ? new Date(event.eventDate).toISOString().slice(0, 10)
            : '',
          venue: event.venue || '',
        });
      } catch (requestError) {
        console.error('Could not load event:', requestError);
        setError('Could not load this event.');
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [editing, id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editing) {
        await axios.put(`${API_URL}/${id}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      navigate('/', {
        state: {
          message: editing
            ? 'Event updated successfully.'
            : 'Event added successfully.',
        },
      });
    } catch (requestError) {
      console.error('Could not save event:', requestError);
      setError(
        requestError.response?.data?.message ||
          'Could not save the event. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p>Loading event…</p>
      </main>
    );
  }

  return (
    <main className="page form-page">
      <section className="form-copy">
        <p className="eyebrow">
          {editing ? 'MAKE A CHANGE' : 'CREATE AN EVENT'}
        </p>
        <h1>{editing ? 'Update event' : 'Add event'}</h1>
        <p className="form-intro">
          {editing
            ? 'Refresh the event details so everything is ready for your guests.'
            : 'Bring people together. Add the event details below to get started.'}
        </p>
      </section>

      <section className="form-card">
        <form onSubmit={handleSubmit}>
          {error && <p className="notice error">{error}</p>}

          <label htmlFor="eventName">Event Name</label>
          <input
            id="eventName"
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            placeholder="e.g. Campus Meetup"
            required
          />

          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What will guests experience at this event?"
            rows="4"
            required
          />

          <div className="form-row">
            <div>
              <label htmlFor="eventDate">Event Date</label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                value={form.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="venue">Venue</label>
              <input
                id="venue"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="Event location"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Saving…'
                : editing
                  ? 'Save changes'
                  : 'Create Event'}
            </button>
            <Link className="cancel-link" to="/">Cancel</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<EventForm />} />
        <Route path="/edit/:id" element={<EventForm editing />} />
      </Routes>
    </>
  );
}