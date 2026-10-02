import { pool } from "../db/pool.js"

export interface AppUser {
    id: string,
    email: string,
    name: string,
    avatarUrl: string | null;
}

interface UserRow {
    id: string,
    email: string,
    name: string,
    avatar_url: string | null,
}

const toUser = (row: UserRow): AppUser => ({
  id: row.id,
  email: row.email,
  name: row.name,
  avatarUrl: row.avatar_url,
});

export async function upsertGoogleUser(input: {
  googleId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;

}): Promise<AppUser> {

    const { rows } = await pool.query<UserRow>(

    `INSERT INTO users (google_id, email, name, avatar_url)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (google_id) DO UPDATE
       SET email = EXCLUDED.email,
           name = EXCLUDED.name,
           avatar_url = EXCLUDED.avatar_url,
           updated_at = now()
     RETURNING id, email, name, avatar_url`,
    
     [input.googleId, input.email, input.name, input.avatarUrl]
  );

  return toUser(rows[0]);
}


export async function findUserById(id: string) {
    const { rows } = await pool.query<UserRow>(
        `SELECT id, email, name, avatar_url, 
        FROM users 
        WHERE id = $1
        `,[id]
    )
    return rows[0] ? toUser(rows[0]) : null;
}
