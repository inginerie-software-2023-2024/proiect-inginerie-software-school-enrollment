FROM gradle:jdk21
COPY --chmod=777 ./backend /usr/src/backend
WORKDIR /usr/src/backend
RUN gradle build
CMD ["gradle", "bootRun"]