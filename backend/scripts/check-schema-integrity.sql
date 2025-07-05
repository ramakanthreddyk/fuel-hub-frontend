-- check-schema-integrity.sql
-- Reports audit columns that are nullable or missing in the given schema
WITH audit AS (
    SELECT 'created_at' AS col
    UNION ALL SELECT 'updated_at'
)
SELECT
    c.table_name,
    a.col AS column_name,
    c.is_nullable
FROM information_schema.columns c
RIGHT JOIN audit a ON c.column_name = a.col AND c.table_schema = $1
WHERE c.column_name IS NULL OR c.is_nullable = 'YES'
ORDER BY c.table_name, column_name;
