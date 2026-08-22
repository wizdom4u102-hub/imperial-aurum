"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  display_order: number;
};

export default function TeamMembers() {
  const supabase = createClient();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("team_members")
          .select(
            "id, name, role, bio, image, display_order"
          )
          .eq("is_active", true)
          .order("display_order", {
            ascending: true,
          });

        if (error) {
          console.error(
            "TEAM MEMBERS LOAD ERROR:",
            error
          );
          return;
        }

        if (mounted) {
          setMembers(data ?? []);
        }
      } catch (error) {
        console.error(
          "TEAM MEMBERS LOAD ERROR:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTeamMembers();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}

        <div className="mb-16 text-center">

          <span className="text-sm uppercase tracking-[6px] text-yellow-400">
            Our Team
          </span>

          <h2 className="mt-4 text-5xl font-bold">
            Meet Our Leadership
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
            Meet the people behind Imperial Aurum and the vision
            driving our platform forward.
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-3xl border border-yellow-500/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {/* TEAM MEMBERS */}

        {!loading && members.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {members.map((member) => {
              const isSelected =
                selectedId === member.id;

              return (
                <div
                  key={member.id}
                  onClick={() =>
                    setSelectedId(
                      isSelected ? null : member.id
                    )
                  }
                  className={`
                    group
                    relative
                    cursor-pointer
                    overflow-hidden
                    rounded-3xl
                    border
                    bg-white/5
                    p-8
                    text-center
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    ${
                      isSelected
                        ? "z-20 scale-105 -translate-y-3 border-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.45)]"
                        : "border-yellow-500/20 hover:scale-105 hover:-translate-y-3 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]"
                    }
                  `}
                >

                  {/* DECORATIVE QUOTE */}

                  <div
                    className={`
                      absolute right-6 top-5 text-5xl
                      text-yellow-400 transition
                      ${
                        isSelected
                          ? "opacity-50"
                          : "opacity-10 group-hover:opacity-40"
                      }
                    `}
                  >
                    ❝
                  </div>

                  {/* PROFILE IMAGE */}

                  <div className="mb-6 flex justify-center">

                    {member.image ? (
                      <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-yellow-400 shadow-lg">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-yellow-400 bg-zinc-900 text-5xl shadow-lg">
                        👤
                      </div>
                    )}

                  </div>

                  {/* NAME */}

                  <h3 className="text-2xl font-bold text-white">
                    {member.name}
                  </h3>

                  {/* ROLE */}

                  <p className="mt-2 text-sm font-semibold uppercase tracking-[3px] text-yellow-400">
                    {member.role}
                  </p>

                  {/* BIO */}

                  {member.bio && (
                    <p className="mt-6 leading-7 text-zinc-400">
                      {member.bio}
                    </p>
                  )}

                  {/* TOUCH HINT */}

                  <p
                    className={`
                      mt-6 text-xs uppercase tracking-widest
                      text-zinc-600 transition
                      ${
                        isSelected
                          ? "text-yellow-400"
                          : "group-hover:text-zinc-400"
                      }
                    `}
                  >
                    {isSelected
                      ? "Tap to close"
                      : "Tap to view"}
                  </p>

                </div>
              );
            })}

          </div>
        )}

        {/* NO MEMBERS */}

        {!loading && members.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <p className="text-zinc-500">
              Our team information will be available soon.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}