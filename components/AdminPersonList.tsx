'use client';

import { useState, useMemo } from 'react';
import { FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown, FaTimes, FaHome, FaUser, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaInbox } from 'react-icons/fa';

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

interface AdminPersonListProps {
  people: Person[];
  onRefresh: () => void;
}

type SortField = 'name' | 'age' | 'number_of_members' | 'house_state' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function AdminPersonList({ people, onRefresh }: AdminPersonListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [houseStateFilter, setHouseStateFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedPeople = useMemo(() => {
    let filtered = [...people];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (person) =>
          person.name.toLowerCase().includes(term) ||
          person.address.toLowerCase().includes(term) ||
          person.house_state.toLowerCase().includes(term)
      );
    }

    // Apply house state filter
    if (houseStateFilter !== 'all') {
      filtered = filtered.filter(
        (person) => person.house_state.toLowerCase() === houseStateFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [people, searchTerm, houseStateFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };


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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <FaSort className="sort-icon" />;
    }
    return sortDirection === 'asc' ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />;
  };

  const houseStates = ['all', 'Safe', 'Partially Damaged', 'Severely Damaged', 'Destroyed'];

  return (
    <div className="admin-list">
      <div className="list-header">
        <h2>Registered People ({filteredAndSortedPeople.length} of {people.length})</h2>
      </div>

      <div className="filters-section">
        <div className="filter-row filter-row-full">
          <div className="filter-group search-group">
            <label htmlFor="search">
              <FaSearch className="label-icon" /> Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, address, or house state..."
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="houseState">
              <FaFilter className="label-icon" /> House State
            </label>
            <select
              id="houseState"
              value={houseStateFilter}
              onChange={(e) => setHouseStateFilter(e.target.value)}
              className="filter-select"
            >
              {houseStates.map((state) => (
                <option key={state} value={state}>
                  {state === 'all' ? 'All States' : state}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortField">
              <FaSort className="label-icon" /> Sort By
            </label>
            <select
              id="sortField"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="filter-select"
            >
              <option value="created_at">Date Added</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
              <option value="number_of_members">Members</option>
              <option value="house_state">House State</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setHouseStateFilter('all');
              setSortField('created_at');
              setSortDirection('desc');
            }}
            className="btn btn-secondary"
          >
            <FaTimes /> Clear Filters
          </button>
        </div>
      </div>

      {filteredAndSortedPeople.length === 0 ? (
        <div className="empty-state">
          <FaInbox size={48} className="empty-icon" />
          <p>No records found matching your filters.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  <FaUser className="th-icon" /> Name {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('age')} className="sortable">
                  <FaCalendarAlt className="th-icon" /> Age {getSortIcon('age')}
                </th>
                <th onClick={() => handleSort('number_of_members')} className="sortable">
                  <FaUsers className="th-icon" /> Members {getSortIcon('number_of_members')}
                </th>
                <th>
                  <FaMapMarkerAlt className="th-icon" /> Address
                </th>
                <th onClick={() => handleSort('house_state')} className="sortable">
                  <FaHome className="th-icon" /> House State {getSortIcon('house_state')}
                </th>
                <th onClick={() => handleSort('created_at')} className="sortable">
                  Date Added {getSortIcon('created_at')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPeople.map((person) => (
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
                  <td>{new Date(person.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

