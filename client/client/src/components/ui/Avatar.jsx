import { memo } from "react";
import { getAvatarHue } from "../../utils/getAvatarHue";

function Avatar({ username, size = "md" }) {
  const hue = getAvatarHue(username);

  return (
    <div
      className={`avatar avatar--${size}`}
      style={{ "--avatar-hue": hue }}
      role="img"
      aria-label={`${username}'s avatar`}
    >
      {username[0].toUpperCase()}
    </div>
  );
}

export default memo(Avatar);