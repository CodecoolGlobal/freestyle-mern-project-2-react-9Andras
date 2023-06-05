import React, { useEffect, useState } from "react";

function UserProfile({ userId, onLogout }) {
  const [userData, setUserData] = useState({ name: '', userName: '' });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [showReviewedMovies, setShowReviewedMovies] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`);
        const userData = await response.json();
        setUserData(userData);
        //console.log(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserData();
  }, [userId]);

  if (!userData) {
    return 'Loading profile...';
  }

  const deleteProfile = async (id) => {
    if (window.confirm('Confirm deletion of your profile')) {
      try {
        await fetch(`http://localhost:3001/api/users/${id}`, {
          method: 'DELETE',
        });
        onLogout();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const fetchReviewedMovies = async () => {
    if (showReviewedMovies) {
      setShowReviewedMovies(false);
    } else {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/reviewedMovies`);
        const reviewedMoviesData = await response.json();
        console.log(reviewedMoviesData);
        setReviewedMovies(reviewedMoviesData);
        setShowReviewedMovies(true);
      } catch (error) {
        console.error('Error fetching reviewed movies:', error);
      }
    }
  }

  const renderReviewedMovies = () => {
    return reviewedMovies.map((movie) => (
      <div key={movie._id}>
        <h3>{movie.movieTitle}</h3>
        <p>{movie.comment}</p>
      </div>
    ));
  };

  const updateUserName = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/username`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUserName }),
      });
      const updatedUser = await response.json();
      setUserData(updatedUser);
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const toggleEditUsername = () => {
    setIsEditingUsername(!isEditingUsername);
    setNewUserName('');
  };

  return (
    <div className="userprofile-container">
      <button onClick={toggleProfile} id="user-shower-button">User Profile</button>
      {isProfileOpen && (
        <div className="form-container" id="userprofil-form">
          <p>Name: {userData.name}</p>
          <p>User Name: {userData.userName}</p>
          <button onClick={toggleEditUsername}>Edit Username</button>
          {isEditingUsername && (
            <form onSubmit={updateUserName}>
              <label htmlFor="newUserName">New Username:</label>
              <input
                type="text"
                id="newUserName"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
              <button type="submit">Update Username</button>
            </form>
          )}
          <button>Favorite Movies</button>
          <br />
          <button onClick={fetchReviewedMovies}>Reviewed Movies</button>
          <br />
          {showReviewedMovies && reviewedMovies.length > 0 && renderReviewedMovies()}
          <br />
          <button onClick={() => deleteProfile(userId)}>Delete Profile</button>
          <button onClick={() => onLogout()}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
