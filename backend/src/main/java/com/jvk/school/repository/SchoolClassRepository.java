package com.jvk.school.repository;

import com.jvk.school.model.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, String> {
}
