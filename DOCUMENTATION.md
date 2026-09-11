## 1. Branching Strategy

All changes must be developed on a dedicated branch created from `main`. The `main` branch contains the stable version of the project and must never receive direct commits.

```text
main
├── feature/name_of_the_feature
├── fix/name_of_the_bug
└── chore/name_of_the_chore
```

### Branch types

- `feature/` is used to develop a new application feature.
- `fix/` is used to correct a bug or an incorrect behavior.
- `chore/` is used for maintenance, documentation, CI or configuration changes.

Branch names should be short, descriptive and written in kebab-case. Examples:

```text
feature/task-filtering
fix/invalid-task-status
chore/update-documentation
```

### Development workflow

1. Create or select a GitHub issue describing the work.
2. Create a branch from `main` using the appropriate prefix.
3. Make small commits with clear and meaningful messages.
4. Run the tests and lint checks locally.
5. Open a pull request and link it to the issue.
6. Ask another team member to review the pull request.
7. Address review feedback and wait for CI to pass.
8. Merge the pull request into `main`.
9. Delete the branch after it has been merged.

### Commit examples

Good commit messages describe the change precisely:

```text
Add task status validation
Add regression test for invalid status
Document the branching strategy
```

Avoid vague messages such as:

```text
update
fix
test
final
final-final
```


