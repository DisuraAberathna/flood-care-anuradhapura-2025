'use client';

interface Person {
  id: number;
  name: string;
  age: number;
  number_of_members: number;
  address: string;
  house_state: string;
  created_at: string;
  updated_at: string;
}

interface PersonListProps {
  people: Person[];
  onEdit: (person: Person) => void;
  onDelete: (id: number) => void;
}

export default function PersonList({ people, onEdit, onDelete }: PersonListProps) {
  const getHouseStateClass = (state: string): string => {
    switch (state.toLowerCase()) {
      case 'safe':
        return 'state-safe';
      case 'partially damaged':
        return 'state-partially-damaged';
      case 'severely damaged':
        return 'state-severely-damaged';
      case 'destroyed':
        return 'state-destroyed';
      default:
        return 'state-default';
    }
  };

  const getHouseStateStyle = (state: string) => {
    switch (state.toLowerCase()) {
      case 'safe':
        return {
          backgroundColor: 'rgba(40, 167, 69, 0.1)', // bg-accent/10
          color: '#28a745', // text-accent
        };
      case 'partially damaged':
        return {
          backgroundColor: 'rgba(255, 193, 7, 0.1)', // bg-accent/10
          color: '#ffc107', // text-accent
        };
      case 'severely damaged':
        return {
          backgroundColor: 'rgba(253, 126, 20, 0.1)', // bg-accent/10
          color: '#fd7e14', // text-accent
        };
      case 'destroyed':
        return {
          backgroundColor: 'rgba(220, 53, 69, 0.1)', // bg-accent/10
          color: '#dc3545', // text-accent
        };
      default:
        return {
          backgroundColor: 'rgba(108, 117, 125, 0.1)', // bg-accent/10
          color: '#6c757d', // text-accent
        };
    }
  };

  if (people.length === 0) {
    return (
      <div className="empty-state">
        <p>No records found. Add a person to get started.</p>
      </div>
    );
  }

  return (
    <div className="person-list">
      <div className="list-header">
        <h2>Registered People ({people.length})</h2>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Members</th>
              <th>Address</th>
              <th>House State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.age}</td>
                <td>{person.number_of_members}</td>
                <td className="address-cell">{person.address}</td>
                <td>
                  <span
                    className={`state-badge ${getHouseStateClass(person.house_state)}`}
                    style={getHouseStateStyle(person.house_state)}
                  >
                    {person.house_state}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(person)}
                      className="btn btn-sm btn-edit"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(person.id)}
                      className="btn btn-sm btn-delete"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

