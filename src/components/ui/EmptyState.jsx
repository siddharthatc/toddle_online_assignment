import ResourcesIllustration from '../../assets/Resources.svg';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-illustration">
        <img
          src={ResourcesIllustration}
          alt="Resources illustration"
          className="empty-state-image"
        />
      </div>
      <h2 className="empty-state-title">Nothing added here yet</h2>
      <p className="empty-state-description">
        Click the <strong>+ Add</strong> button to create your first module or
        upload resources
      </p>
    </div>
  );
};

export default EmptyState;
