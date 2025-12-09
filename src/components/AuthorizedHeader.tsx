import { graphql, useFragment } from "react-relay";
import { AuthorizedHeader_user$key } from "./__generated__/AuthorizedHeader_user.graphql";

export const AuthorizedHeader = ({
  user,
  onLogout,
}: {
  user: AuthorizedHeader_user$key;
  onLogout: () => void;
}) => {
  const data = useFragment(
    graphql`
      fragment AuthorizedHeader_user on User {
        name
        login
        email

        avatarUrl(size: 96)
      }
    `,
    user
  );

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img
          src={data.avatarUrl}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="text-zinc-600 dark:text-zinc-400">Welcome,</p>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {data.name || data.login}
          </h1>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
};
