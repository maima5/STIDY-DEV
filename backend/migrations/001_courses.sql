-- Jadwal Belajar berbasis mata kuliah (courses -> materials -> attachments).
-- Jalankan dengan `npm run migrate` (aman dijalankan berulang kali / idempotent).
-- (Sudah ikut disalin ke schema.sql untuk setup dari nol.)

create table if not exists courses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  name          varchar(100) not null,
  exam_date     date         not null,
  hours_per_day smallint     not null default 2 check (hours_per_day between 1 and 24),
  created_at    timestamptz  not null default now(),
  updated_at    timestamptz  not null default now()
);
create index if not exists courses_user_idx on courses (user_id, exam_date);
drop trigger if exists courses_updated on courses;
create trigger courses_updated before update on courses
  for each row execute function set_updated_at();

create table if not exists course_materials (
  id               uuid primary key default gen_random_uuid(),
  course_id        uuid not null references courses(id) on delete cascade,
  position         int          not null default 0,       -- urutan materi di dalam mata kuliah
  title            varchar(200) not null,
  estimate_minutes int          not null default 45 check (estimate_minutes > 0),
  level            varchar(10)  not null default 'Menengah' check (level in ('Dasar', 'Menengah', 'Lanjut')),
  completed_on     date,                                   -- null = belum selesai
  note             text         not null default '',
  summary          jsonb,                                  -- ringkasan materi (diisi fitur AI)
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now()
);
create index if not exists course_materials_course_idx on course_materials (course_id, position);
drop trigger if exists course_materials_updated on course_materials;
create trigger course_materials_updated before update on course_materials
  for each row execute function set_updated_at();

create table if not exists material_attachments (
  id          uuid primary key default gen_random_uuid(),
  material_id uuid not null references course_materials(id) on delete cascade,
  name        varchar(255) not null,
  description varchar(255) not null default '',
  url         text,
  created_at  timestamptz  not null default now()
);
create index if not exists material_attachments_material_idx on material_attachments (material_id);

alter table courses              enable row level security;
alter table course_materials     enable row level security;
alter table material_attachments enable row level security;
