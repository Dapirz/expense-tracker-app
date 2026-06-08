const TeamProfile = () => {
  const members = [
    {
      name: "Daffa Irsandy Putra",
      id: "103012300338",
      initial: "DP"
    },
    {
      name: "Farriz Jihady Hanifa",
      id: "103012300102",
      initial: "FH"
    },
    {
      name: "Alvito Buana",
      id: "103012300232",
      initial: "AB"
    },
    {
      name: "Muhammad Daffa Adhima Yudistira",
      id: "1301204464",
      initial: "MY"
    }
  ];

  return (
    <main className="profiles-container">
      <h1 className="profiles-title">Development Team</h1>
      
      <div className="profiles-grid">
        {members.map((member) => (
          <div className="profile-card" key={member.id}>
            <div className="profile-avatar">
              {member.initial}
            </div>
            <h2 className="profile-name">{member.name}</h2>
            <div className="profile-id">NIM: {member.id}</div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default TeamProfile;
