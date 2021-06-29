### Developer Workflow

All NGP projects use git-flow branching model for maintaining the repositories. In this branching model, there are some guidelines to be followed:

1. Never directly commit to master and develop branches
2. Updates to the master and develop branches happen only when a `release finish` or a `feature finish` is executed.

#### A typical workflow

1. Clone a project: `git clone git@gitserver:/ngp/user-management.git`
2. Initialize git-flow: `git flow init -d`
3. Check that the build is successful and all tests are passing: `./gradlew`
4. Create your branch for working: `git flow feature start may-the-force-be-with-you`
5. Work on the branch.    
  * Make frequent commits. Frequent commits lets you rollback recent changes. Thumbrule is to commit whenever all your UTs are passing.
  * Avoid pushing feature branches to git server. If you do push, ensure the branch is removed from the server using `git push origin :feature/xxx` command whenever you finish the feature and merged it into develop.
  * At logical points of your work, rebase with develop branch. This ensures that you do not need to perform a *big bang* merge with develop branch when your changes are complete.
  * If you pushed your branch to git server, after a rebase the branches do diverge. You need to do a `git push -f` to update the branch.
6. When you finish your change: `git rebase -i develop`. Squash your commits and change commit messages to publishable quality. Fix any merge conflicts.
7. Move your changes to develop: `git flow feature finish`
8. Check the build and all tests are passing.
9. Push to the server: `git push --all`
10. DONE. Start with another feature branch ;-)

#### Commit messages

We shall follow the below structure for commit messages:

All changes are split into the following categories (picked up from angularjs):

- chore
- docs
- style
- feat
- fix
- refactor
- test

A commit message should have a subject line and a body. If a body exists, separate it from the header with a new line. Subject lines starts with the category and the main resource modified or feature name in brackets. A colon separates this from the message.

Example:

```
fix(build.gradle): Copying gradle files without modifications

createApplication task is copying gradle files after content modifications, that corrupts the gradle JAR file.
```

Another:

```
feat(create-new-user): Added support for creating a new user

* Created API specification
* Modified UserEntity to add `supervisor` field
```
