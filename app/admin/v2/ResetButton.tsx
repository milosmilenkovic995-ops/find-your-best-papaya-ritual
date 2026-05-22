"use client";

export default function ResetButtonV2() {
  return (
    <form
      method="POST"
      action="/api/admin/reset-v2"
      onSubmit={(e) => {
        if (
          !confirm(
            "Reset ALL v2 submissions?\n\nThis permanently deletes every row in submissions_v2. There is NO undo.\n\nv1 data in `submissions` will NOT be touched."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:border-red-400 hover:bg-red-100"
      >
        Reset v2 data
      </button>
    </form>
  );
}
